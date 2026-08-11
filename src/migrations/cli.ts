/**
 * Mongo schema/data migrations CLI.
 *
 * Usage:
 *   npm run migrate:status
 *   npm run migrate:up
 *
 * In production image:
 *   node dist/migrations/cli.js status
 *   node dist/migrations/cli.js up
 */
import dotenv from "dotenv";
import {
  connectDb,
  dbHostLabel,
  disconnectDb,
  getMigrationStatus,
  runMigrationsUp,
} from "./runner";

dotenv.config();

const usage = (): never => {
  console.error("Usage: migrate:up | migrate:status");
  process.exit(1);
};

const main = async () => {
  const command = (process.argv[2] || "").toLowerCase();
  if (command !== "up" && command !== "status") {
    usage();
  }

  const dbUrl = process.env.DBURL;
  if (!dbUrl) {
    throw new Error("DBURL is not set");
  }

  console.log(`Migrations target: ${dbHostLabel(dbUrl)} / studio`);

  const db = await connectDb(dbUrl);

  try {
    if (command === "status") {
      const rows = await getMigrationStatus(db);
      if (rows.length === 0) {
        console.log("No migration files found.");
        return;
      }
      for (const row of rows) {
        console.log(
          `${row.applied ? "APPLIED" : "PENDING"}  ${row.id}  (${row.file})`
        );
      }
      return;
    }

    const applied = await runMigrationsUp(db);
    if (applied.length === 0) {
      console.log("No pending migrations.");
    } else {
      console.log(`Done. Applied ${applied.length}: ${applied.join(", ")}`);
    }
  } finally {
    await disconnectDb();
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
