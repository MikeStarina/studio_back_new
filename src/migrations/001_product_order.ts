import type { Db, ObjectId } from "mongodb";

export const id = "001_product_order";

/**
 * Backfill product.order for documents missing the field.
 * Assigns 0, 10, 20, … by createdAt asc so admins can insert between values.
 * Documents that already have order are left untouched.
 */
export async function up(db: Db): Promise<void> {
  const products = db.collection("products");
  const missing = await products
    .find({
      $or: [{ order: { $exists: false } }, { order: null }],
    })
    .sort({ createdAt: 1, _id: 1 })
    .project({ _id: 1 })
    .toArray();

  if (missing.length === 0) {
    console.log("001_product_order: nothing to backfill");
    return;
  }

  const ops = missing.map((doc, index) => ({
    updateOne: {
      filter: { _id: doc._id as ObjectId },
      update: { $set: { order: index * 10 } },
    },
  }));

  const result = await products.bulkWrite(ops, { ordered: true });
  console.log(
    `001_product_order: updated ${result.modifiedCount} of ${missing.length} products`
  );
}
