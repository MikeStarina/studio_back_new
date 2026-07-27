/**
 * Copies legacy product photos stored in the bucket root as `{slug}_{N}.{ext}`
 * to the new `products/{productId}/{uuid}.{ext}` scheme and fills the `photos`
 * field of each product with the resulting CDN URLs.
 *
 * The script never deletes anything: the original objects stay in place so
 * production keeps working during the rollout. Use the generated
 * `migration-report.json` to remove them manually afterwards.
 *
 * Usage:
 *   npm run migrate:photos:dry   - only report what would happen
 *   npm run migrate:photos       - copy objects and update the database
 */
import crypto from "crypto";
import path from "path";
import { writeFile } from "fs/promises";
import dotenv from "dotenv";
import mongoose from "mongoose";
import product from "../models/product";
import {
  buildCdnUrl,
  copyObject,
  getProductPhotosPrefix,
  listObjectKeys,
  objectExists,
} from "../utils/yandex-storage";

dotenv.config();

const LEGACY_KEY_RE = /^(.+)_(\d+)\.(jpg|jpeg|png|webp)$/i;

type LegacyFile = {
  key: string;
  slug: string;
  index: number;
  ext: string;
};

type PlannedCopy = {
  from: string;
  to: string;
  url: string;
};

type PlannedProduct = {
  productId: string;
  slug: string;
  copies: PlannedCopy[];
};

type Report = {
  generatedAt: string;
  mode: "dry-run" | "apply";
  products: PlannedProduct[];
  skipped: Array<{ productId: string; slug: string; reason: string }>;
  orphans: string[];
  failures: Array<{ from: string; to: string; error: string }>;
};

const REPORT_PATH = path.resolve(process.cwd(), "migration-report.json");

const parseLegacyKey = (key: string): LegacyFile | null => {
  // Legacy photos live in the bucket root, nested keys belong to other features.
  if (key.includes("/")) return null;
  const match = LEGACY_KEY_RE.exec(key);
  if (!match) return null;
  return {
    key,
    slug: match[1],
    index: Number(match[2]),
    ext: `.${match[3].toLowerCase()}`,
  };
};

const run = async () => {
  const isDryRun = process.argv.includes("--dry-run");
  const dbUrl = process.env.DBURL;
  if (!dbUrl) {
    throw new Error("DBURL is not set");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(dbUrl, { dbName: "studio" });

  const report: Report = {
    generatedAt: new Date().toISOString(),
    mode: isDryRun ? "dry-run" : "apply",
    products: [],
    skipped: [],
    orphans: [],
    failures: [],
  };

  const keys = await listObjectKeys();
  const bySlug = new Map<string, LegacyFile[]>();
  for (const key of keys) {
    const parsed = parseLegacyKey(key);
    if (!parsed) continue;
    const group = bySlug.get(parsed.slug) ?? [];
    group.push(parsed);
    bySlug.set(parsed.slug, group);
  }

  console.log(
    `Found ${bySlug.size} legacy slug group(s) among ${keys.length} object(s) in the bucket`
  );

  const products = await product
    .find({ slug: { $in: Array.from(bySlug.keys()) } })
    .select("_id slug photos");

  const matchedSlugs = new Set<string>();

  for (const doc of products) {
    const slug = String(doc.slug);
    matchedSlugs.add(slug);

    if (Array.isArray(doc.photos) && doc.photos.length > 0) {
      report.skipped.push({
        productId: String(doc._id),
        slug,
        reason: "photos already filled",
      });
      continue;
    }

    const files = (bySlug.get(slug) ?? []).sort((a, b) => a.index - b.index);
    const copies: PlannedCopy[] = files.map((file) => {
      const to = `${getProductPhotosPrefix()}/${doc._id}/${crypto.randomUUID()}${file.ext}`;
      return { from: file.key, to, url: buildCdnUrl(to) };
    });

    const planned: PlannedProduct = {
      productId: String(doc._id),
      slug,
      copies,
    };
    report.products.push(planned);

    if (isDryRun) {
      console.log(`[dry-run] ${slug}: ${copies.length} file(s) would be copied`);
      continue;
    }

    const urls: string[] = [];
    for (const copy of copies) {
      try {
        await copyObject(copy.from, copy.to);
        if (!(await objectExists(copy.to))) {
          throw new Error("copy verification failed");
        }
        urls.push(copy.url);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        report.failures.push({ from: copy.from, to: copy.to, error: message });
        console.error(`Failed to copy ${copy.from} -> ${copy.to}: ${message}`);
      }
    }

    if (urls.length) {
      await product.updateOne({ _id: doc._id }, { $set: { photos: urls } });
      console.log(`${slug}: ${urls.length} photo(s) copied and saved`);
    }
  }

  for (const slug of bySlug.keys()) {
    if (matchedSlugs.has(slug)) continue;
    for (const file of bySlug.get(slug) ?? []) {
      report.orphans.push(file.key);
    }
  }

  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  await mongoose.disconnect();

  console.log("---");
  console.log(`Products planned/processed: ${report.products.length}`);
  console.log(`Skipped: ${report.skipped.length}`);
  console.log(`Orphan files (no matching product): ${report.orphans.length}`);
  console.log(`Failures: ${report.failures.length}`);
  console.log(`Report written to ${REPORT_PATH}`);
};

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
