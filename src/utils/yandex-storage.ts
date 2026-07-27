import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  CopyObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
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
  const blogCoversPrefix = (
    process.env.YANDEX_S3_BLOG_COVERS_PREFIX ?? "blog-covers"
  ).replace(/^\/+|\/+$/g, "");
  const productPhotosPrefix = (
    process.env.YANDEX_S3_PRODUCT_PHOTOS_PREFIX ?? "products"
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
    blogCoversPrefix,
    productPhotosPrefix,
    cdnPublicUrl,
  };
};

export const getBannersPrefix = () => getConfig().bannersPrefix;
export const getBlogCoversPrefix = () => getConfig().blogCoversPrefix;
export const getProductPhotosPrefix = () => getConfig().productPhotosPrefix;

export const buildCdnUrl = (key: string): string =>
  `${getConfig().cdnPublicUrl}/${key.replace(/^\/+/, "")}`;

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
  return uploadObject(key, body, contentType);
};

export const uploadBlogCoverObject = async (
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> => {
  return uploadObject(key, body, contentType);
};

export const uploadProductPhotoObject = async (
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> => {
  return uploadObject(key, body, contentType);
};

const uploadObject = async (
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> => {
  const { client, bucket } = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return buildCdnUrl(key);
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

/** Server-side copy within the same bucket. Source object is left untouched. */
export const copyObject = async (
  srcKey: string,
  destKey: string
): Promise<string> => {
  const { client, bucket } = getClient();
  await client.send(
    new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `${bucket}/${srcKey}`,
      Key: destKey,
    })
  );
  return buildCdnUrl(destKey);
};

export const objectExists = async (key: string): Promise<boolean> => {
  const { client, bucket } = getClient();
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
};

/** Lists every object key under a prefix, following pagination. */
export const listObjectKeys = async (prefix?: string): Promise<string[]> => {
  const { client, bucket } = getClient();
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response: any = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );
    for (const item of response.Contents ?? []) {
      if (item.Key) keys.push(item.Key);
    }
    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return keys;
};

export const deleteObjectsByPrefix = async (prefix: string): Promise<void> => {
  const normalized = prefix.replace(/^\/+/, "");
  if (!normalized) return;

  const keys = await listObjectKeys(normalized);
  if (!keys.length) return;

  const { client, bucket } = getClient();
  // DeleteObjects accepts at most 1000 keys per request.
  for (let i = 0; i < keys.length; i += 1000) {
    const chunk = keys.slice(i, i + 1000);
    await client.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: { Objects: chunk.map((Key) => ({ Key })) },
      })
    );
  }
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
