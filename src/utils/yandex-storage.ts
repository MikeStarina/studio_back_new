import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const getConfig = () => {
  const accessKeyId = process.env.YANDEX_S3_ACCESS_KEY_ID ?? "";
  const secretAccessKey = process.env.YANDEX_S3_SECRET_ACCESS_KEY ?? "";
  const bucket = process.env.YANDEX_S3_BUCKET ?? "";
  const endpoint =
    process.env.YANDEX_S3_ENDPOINT ?? "https://storage.yandexcloud.net";
  const region = process.env.YANDEX_S3_REGION ?? "ru-central1";
  const bannersPrefix = (
    process.env.YANDEX_S3_BANNERS_PREFIX ?? "banners"
  ).replace(/^\/+|\/+$/g, "");
  const cdnPublicUrl = (
    process.env.CDN_PUBLIC_URL ?? "https://cdn.pnhd.ru"
  ).replace(/\/+$/, "");

  return {
    accessKeyId,
    secretAccessKey,
    bucket,
    endpoint,
    region,
    bannersPrefix,
    cdnPublicUrl,
  };
};

export const getBannersPrefix = () => getConfig().bannersPrefix;

const getClient = () => {
  const { accessKeyId, secretAccessKey, bucket, endpoint, region } =
    getConfig();
  if (!accessKeyId || !secretAccessKey || !bucket) {
    throw new Error(
      "Yandex Object Storage is not configured (YANDEX_S3_ACCESS_KEY_ID, YANDEX_S3_SECRET_ACCESS_KEY, YANDEX_S3_BUCKET)"
    );
  }
  return {
    client: new S3Client({
      region,
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: false,
    }),
    bucket,
  };
};

export const uploadBannerObject = async (
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> => {
  const { client, bucket } = getClient();
  const { cdnPublicUrl } = getConfig();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return `${cdnPublicUrl}/${key}`;
};

export const deleteObjectByKey = async (key: string): Promise<void> => {
  const { client, bucket } = getClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
};

/** Extract object key from a CDN URL like https://cdn.pnhd.ru/banners/uuid.jpg */
export const keyFromCdnUrl = (url: string): string | null => {
  if (!url) return null;
  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const pathname = new URL(url).pathname.replace(/^\/+/, "");
      return pathname || null;
    }
    return url.replace(/^\/+/, "") || null;
  } catch {
    return null;
  }
};
