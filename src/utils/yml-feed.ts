export type YmlFeedCategory = {
  _id: { toString(): string };
  label: string;
};

export type YmlFeedProduct = {
  _id: { toString(): string };
  slug?: string | null;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  color?: string | null;
  type?: string | null;
  oneCCode?: string | null;
  photos?: string[] | null;
  galleryPhotos?: string[] | null;
  image_url?: string | null;
  category?: Array<{ toString(): string } | string> | null;
  sizes?: Array<{ name?: string | null; qty?: number | null }> | null;
  shippingParams?: {
    weight?: number | null;
    width?: number | null;
    length?: number | null;
    depth?: number | null;
  } | null;
};

export type YmlFeedShopConfig = {
  name: string;
  company: string;
  url: string;
  cdnPublicUrl: string;
  apiPublicUrl: string;
  deliveryCost: number;
  deliveryDays: string;
  vendor: string;
};

/** Stable positive int from Mongo ObjectId (last 8 hex chars). */
export const categoryIdFromObjectId = (id: string): number => {
  const hex = id.replace(/[^a-fA-F0-9]/g, "").slice(-8);
  const n = parseInt(hex || "1", 16);
  return Number.isFinite(n) && n > 0 ? n : 1;
};

export const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Strip ASCII control chars except tab/LF/CR (Yandex feed rules). */
export const sanitizeFeedText = (value: string): string =>
  value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");

export const wrapCdata = (value: string): string => {
  const safe = sanitizeFeedText(value).replace(/]]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[${safe}]]>`;
};

export const toMoscowRfc3339 = (date: Date): string => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get(
    "minute"
  )}:${get("second")}+03:00`;
};

export const absoluteMediaUrl = (
  url: string | null | undefined,
  apiPublicUrl: string
): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = apiPublicUrl.replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
};

/** True when product has an explicit photo URL (not a guessed CDN key). */
export const hasProductPicture = (product: YmlFeedProduct): boolean => {
  if (product.photos?.[0]) return true;
  if (product.image_url) return true;
  if (product.galleryPhotos?.[0]) return true;
  return false;
};

export const productPictureUrl = (
  product: YmlFeedProduct,
  cdnPublicUrl: string,
  apiPublicUrl: string
): string => {
  const fromPhotos = product.photos?.[0];
  if (fromPhotos) return fromPhotos;

  const fromImage = absoluteMediaUrl(product.image_url, apiPublicUrl);
  if (fromImage) return fromImage;

  const fromGallery = absoluteMediaUrl(product.galleryPhotos?.[0], apiPublicUrl);
  if (fromGallery) return fromGallery;

  const slug = typeof product.slug === "string" ? product.slug.trim() : "";
  if (!slug) return "";
  // Last-resort legacy key used only when hasProductPicture already passed.
  return `${cdnPublicUrl.replace(/\/$/, "")}/${slug}_0.jpg`;
};

const isAvailable = (product: YmlFeedProduct): boolean =>
  Array.isArray(product.sizes) &&
  product.sizes.some((s) => typeof s?.qty === "number" && s.qty > 0);

const firstCategoryId = (
  product: YmlFeedProduct,
  knownCategoryIds: Set<number>
): number | null => {
  const raw = product.category?.[0];
  if (!raw) return null;
  const id = categoryIdFromObjectId(String(raw));
  return knownCategoryIds.has(id) ? id : null;
};

const formatWeightKg = (gramsOrKg: number): string | null => {
  if (!Number.isFinite(gramsOrKg) || gramsOrKg <= 0) return null;
  // Studio stores shipping weight in grams (e.g. 300, 900).
  const kg = gramsOrKg > 20 ? gramsOrKg / 1000 : gramsOrKg;
  return String(Math.round(kg * 1000) / 1000);
};

const formatDimensions = (
  params: YmlFeedProduct["shippingParams"]
): string | null => {
  if (!params) return null;
  const { length, width, depth } = params;
  if (
    typeof length !== "number" ||
    typeof width !== "number" ||
    typeof depth !== "number" ||
    length <= 0 ||
    width <= 0 ||
    depth <= 0
  ) {
    return null;
  }
  return `${length}/${width}/${depth}`;
};

const tag = (name: string, value: string): string =>
  `<${name}>${value}</${name}>`;

export const buildYmlFeed = (
  products: YmlFeedProduct[],
  categories: YmlFeedCategory[],
  shop: YmlFeedShopConfig,
  generatedAt: Date = new Date()
): string => {
  const knownCategoryIds = new Set(
    categories.map((c) => categoryIdFromObjectId(c._id.toString()))
  );

  const categoryXml = categories
    .map((c) => {
      const id = categoryIdFromObjectId(c._id.toString());
      const label = escapeXml(sanitizeFeedText(c.label || ""));
      if (!label) return "";
      return `            <category id="${id}">${label}</category>`;
    })
    .filter(Boolean)
    .join("\n");

  const offerXml = products
    .map((product) => {
      const name =
        typeof product.name === "string"
          ? sanitizeFeedText(product.name).trim()
          : "";
      const price =
        typeof product.price === "number" && Number.isFinite(product.price)
          ? product.price
          : null;
      const slug =
        typeof product.slug === "string" ? product.slug.trim() : "";
      const categoryId = firstCategoryId(product, knownCategoryIds);
      if (
        !name ||
        price === null ||
        price < 0 ||
        !slug ||
        !categoryId ||
        !hasProductPicture(product)
      ) {
        return "";
      }

      const picture = productPictureUrl(
        product,
        shop.cdnPublicUrl,
        shop.apiPublicUrl
      );
      if (!picture) return "";

      const available = isAvailable(product) ? "true" : "false";
      const url = `${shop.url.replace(/\/$/, "")}/shop/${slug}`;
      const lines: string[] = [
        `            <offer id="${escapeXml(
          product._id.toString()
        )}" available="${available}">`,
        `                ${tag("name", escapeXml(name))}`,
        `                ${tag("vendor", escapeXml(shop.vendor))}`,
      ];

      if (product.oneCCode) {
        lines.push(
          `                ${tag(
            "vendorCode",
            escapeXml(sanitizeFeedText(String(product.oneCCode)))
          )}`
        );
      }

      lines.push(
        `                ${tag("url", escapeXml(url))}`,
        `                ${tag("price", String(price))}`,
        `                ${tag("currencyId", "RUR")}`,
        `                ${tag("categoryId", String(categoryId))}`,
        `                ${tag("picture", escapeXml(picture))}`
      );

      if (product.description) {
        lines.push(
          `                <description>${wrapCdata(
            String(product.description)
          )}</description>`
        );
      }

      if (product.color) {
        lines.push(
          `                <param name="Цвет">${escapeXml(
            sanitizeFeedText(String(product.color))
          )}</param>`
        );
      }
      if (product.type) {
        lines.push(
          `                <param name="Тип">${escapeXml(
            sanitizeFeedText(String(product.type))
          )}</param>`
        );
      }

      const weight = formatWeightKg(Number(product.shippingParams?.weight));
      if (weight) {
        lines.push(`                ${tag("weight", weight)}`);
      }
      const dimensions = formatDimensions(product.shippingParams);
      if (dimensions) {
        lines.push(`                ${tag("dimensions", dimensions)}`);
      }

      lines.push("            </offer>");
      return lines.join("\n");
    })
    .filter(Boolean)
    .join("\n");

  const shopName = escapeXml(sanitizeFeedText(shop.name));
  const company = escapeXml(sanitizeFeedText(shop.company));
  const shopUrl = escapeXml(shop.url.replace(/\/$/, ""));

  return `<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="${toMoscowRfc3339(generatedAt)}">
    <shop>
        <name>${shopName}</name>
        <company>${company}</company>
        <url>${shopUrl}</url>
        <currencies>
            <currency id="RUR" rate="1"/>
        </currencies>
        <categories>
${categoryXml}
        </categories>
        <delivery-options>
            <option cost="${shop.deliveryCost}" days="${escapeXml(
    shop.deliveryDays
  )}"/>
        </delivery-options>
        <offers>
${offerXml}
        </offers>
    </shop>
</yml_catalog>
`;
};
