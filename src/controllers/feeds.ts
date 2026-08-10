import { Request, Response, NextFunction } from "express";
import product from "../models/product";
import category from "../models/category";
import { FRONTEND_URL, PUBLIC_API_URL } from "../config";
import ServerError from "../utils/server-error-class";
import {
  buildYmlFeed,
  YmlFeedCategory,
  YmlFeedProduct,
  YmlFeedShopConfig,
} from "../utils/yml-feed";

type FeedCache = {
  xml: string;
  expiresAt: number;
  maxAgeSeconds: number;
};

let cache: FeedCache | null = null;

const getCdnPublicUrl = (): string =>
  (process.env.CDN_PUBLIC_URL ?? "https://cdn.pnhd.ru").replace(/\/+$/, "");

const getCacheTtlSeconds = (): number => {
  const seconds = parseInt(process.env.YML_CACHE_TTL_SECONDS ?? "900", 10);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : 900;
};

const getShopConfig = (): YmlFeedShopConfig => {
  const deliveryCost = parseInt(process.env.YML_DELIVERY_COST ?? "400", 10);
  return {
    name: process.env.YML_SHOP_NAME ?? "PNHD STUDIO",
    company: process.env.YML_COMPANY ?? "PNHD",
    url: FRONTEND_URL.replace(/\/$/, ""),
    cdnPublicUrl: getCdnPublicUrl(),
    apiPublicUrl: PUBLIC_API_URL,
    deliveryCost:
      Number.isFinite(deliveryCost) && deliveryCost >= 0 ? deliveryCost : 400,
    deliveryDays: process.env.YML_DELIVERY_DAYS ?? "2-5",
    vendor: process.env.YML_VENDOR ?? "PNHD",
  };
};

export const getProductsYmlFeed = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const now = Date.now();
    if (cache && cache.expiresAt > now) {
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.setHeader(
        "Cache-Control",
        `public, max-age=${cache.maxAgeSeconds}`
      );
      res.setHeader("X-Yml-Cache", "HIT");
      return res.status(200).send(cache.xml);
    }

    const generatedAt = new Date();
    const [products, categories] = await Promise.all([
      product.find({}).lean(),
      category.find({}).sort({ order: 1 }).lean(),
    ]);

    const xml = buildYmlFeed(
      products as unknown as YmlFeedProduct[],
      categories as unknown as YmlFeedCategory[],
      getShopConfig(),
      generatedAt
    );

    const maxAgeSeconds = getCacheTtlSeconds();
    cache = {
      xml,
      expiresAt: Date.now() + maxAgeSeconds * 1000,
      maxAgeSeconds,
    };

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", `public, max-age=${maxAgeSeconds}`);
    res.setHeader("X-Yml-Cache", "MISS");
    return res.status(200).send(xml);
  } catch (err) {
    console.error("YML feed generation failed:", err);
    return next(ServerError.error500());
  }
};

/** Test helper / future invalidation on product writes. */
export const clearYmlFeedCache = (): void => {
  cache = null;
};
