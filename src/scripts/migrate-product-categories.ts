/**
 * Migrates products from the legacy `category` shape (a single string, or an
 * array of slug strings like "man"/"woman") to the current shape: an array of
 * ObjectId references into the new `category` collection.
 *
 * Steps:
 *   1. Seed the historically hardcoded categories (man/woman/kids/accesorize)
 *      into the `category` collection, if they don't already exist.
 *   2. For every product, resolve each raw category value to a category id:
 *      - if it's already a valid id of an existing category, keep it;
 *      - if it matches a known legacy slug, replace it with that category's id;
 *      - otherwise, log it and drop it.
 *
 * Safe to run multiple times: already-migrated products (holding real
 * category ids) are left as-is.
 *
 * Usage:
 *   npm run migrate:categories
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import product from "../models/product";
import category from "../models/category";

dotenv.config();

const LEGACY_LABELS: Record<string, string> = {
  man: "Мужское",
  woman: "Женское",
  kids: "Детское",
  accesorize: "Аксессуары",
};

const run = async () => {
  const dbUrl = process.env.DBURL;
  if (!dbUrl) {
    throw new Error("DBURL is not set");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(dbUrl, { dbName: "studio" });

  const slugToId = new Map<string, string>();
  for (const [slug, label] of Object.entries(LEGACY_LABELS)) {
    let doc = await category.findOne({ slug });
    if (!doc) {
      doc = await category.create({ slug, label });
      console.log(`Created category "${label}" (${slug})`);
    }
    slugToId.set(slug, String(doc._id));
  }

  const existingIds = new Set(
    (await category.find({}).select("_id")).map((doc) => String(doc._id))
  );

  // .lean() returns plain driver-level objects, bypassing Mongoose's schema
  // casting — required here since legacy documents may still hold a bare
  // string where the schema now expects an array of ObjectId refs.
  const products = await product
    .find({})
    .select("_id category")
    .lean<Array<{ _id: mongoose.Types.ObjectId; category: unknown }>>();
  let updated = 0;
  let unchanged = 0;
  const droppedValues: Array<{ productId: string; value: unknown }> = [];

  for (const doc of products) {
    const raw = doc.category;
    const rawValues: string[] = Array.isArray(raw)
      ? raw.map(String)
      : typeof raw === "string" && raw
        ? [raw]
        : [];

    const resolvedIds: string[] = [];
    for (const value of rawValues) {
      if (existingIds.has(value)) {
        resolvedIds.push(value);
        continue;
      }
      const mapped = slugToId.get(value);
      if (mapped) {
        resolvedIds.push(mapped);
        continue;
      }
      droppedValues.push({ productId: String(doc._id), value });
    }

    const isSameShape =
      resolvedIds.length === rawValues.length &&
      resolvedIds.every((id, i) => id === rawValues[i]);

    if (isSameShape) {
      unchanged += 1;
      continue;
    }

    if (resolvedIds.length < 1) {
      console.warn(
        `Product ${doc._id}: no valid category could be resolved from`,
        rawValues,
        "— left untouched, fix manually."
      );
      continue;
    }

    await product.collection.updateOne(
      { _id: doc._id },
      { $set: { category: resolvedIds.map((id) => new mongoose.Types.ObjectId(id)) } }
    );
    updated += 1;
  }

  console.log("---");
  console.log(`Products scanned: ${products.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Already migrated / unchanged: ${unchanged}`);
  if (droppedValues.length) {
    console.log(`Unrecognized category values dropped: ${droppedValues.length}`);
    console.table(droppedValues);
  }

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
