/**
 * Seeds the starter tags (SALE / NEW) into the `tag` collection, if they
 * don't already exist.
 *
 * Safe to run multiple times: matching happens by slug, so existing tags
 * are left untouched.
 *
 * Usage:
 *   npm run seed:tags
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import tag from "../models/tag";

dotenv.config();

const STARTER_TAGS: Array<{ slug: string; label: string; order: number }> = [
  { slug: "sale", label: "SALE", order: 0 },
  { slug: "new", label: "NEW", order: 1 },
];

const run = async () => {
  const dbUrl = process.env.DBURL;
  if (!dbUrl) {
    throw new Error("DBURL is not set");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(dbUrl, { dbName: "studio" });

  for (const { slug, label, order } of STARTER_TAGS) {
    const existing = await tag.findOne({ slug });
    if (existing) {
      console.log(`Tag "${label}" (${slug}) already exists — skipping.`);
      continue;
    }
    await tag.create({ slug, label, order });
    console.log(`Created tag "${label}" (${slug}).`);
  }

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
