import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import type { Db } from "mongodb";
import { Migration, SCHEMA_MIGRATIONS_COLLECTION } from "./types";

const MIGRATION_FILE_RE = /^\d+_.+\.(js|ts)$/;

const isMigrationFile = (name: string): boolean =>
  MIGRATION_FILE_RE.test(name) && !name.endsWith(".d.ts");

/** Safe host for logs (no credentials). */
export const dbHostLabel = (dbUrl: string): string => {
  try {
    const normalized = dbUrl.replace(/^mongodb(\+srv)?:\/\//, "http://");
    const url = new URL(normalized);
    return `${url.hostname}${url.port ? `:${url.port}` : ""}`;
  } catch {
    return "(unparseable DBURL)";
  }
};

export const connectDb = async (dbUrl: string): Promise<Db> => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(dbUrl, { dbName: "studio" });
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Mongo connection has no db handle");
  }
  return db;
};

export const disconnectDb = async (): Promise<void> => {
  await mongoose.disconnect();
};

const migrationsDir = (): string => __dirname;

export const listMigrationFiles = (): string[] => {
  const dir = migrationsDir();
  return fs
    .readdirSync(dir)
    .filter(isMigrationFile)
    .sort((a, b) => a.localeCompare(b, "en"));
};

export const loadMigration = (fileName: string): Migration => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(path.join(migrationsDir(), fileName)) as Partial<Migration>;
  const fallbackId = fileName.replace(/\.(js|ts)$/, "");
  const id = typeof mod.id === "string" && mod.id.trim() ? mod.id.trim() : fallbackId;
  if (typeof mod.up !== "function") {
    throw new Error(`Migration ${fileName} must export async function up(db)`);
  }
  return { id, up: mod.up };
};

const getAppliedIds = async (db: Db): Promise<Set<string>> => {
  const docs = await db
    .collection(SCHEMA_MIGRATIONS_COLLECTION)
    .find({}, { projection: { _id: 1 } })
    .toArray();
  return new Set(docs.map((d) => String(d._id)));
};

export type MigrationStatusRow = {
  id: string;
  file: string;
  applied: boolean;
};

export const getMigrationStatus = async (
  db: Db
): Promise<MigrationStatusRow[]> => {
  const applied = await getAppliedIds(db);
  return listMigrationFiles().map((file) => {
    const { id } = loadMigration(file);
    return { id, file, applied: applied.has(id) };
  });
};

export const runMigrationsUp = async (db: Db): Promise<string[]> => {
  const applied = await getAppliedIds(db);
  const appliedNow: string[] = [];

  for (const file of listMigrationFiles()) {
    const migration = loadMigration(file);
    if (applied.has(migration.id)) {
      continue;
    }

    console.log(`Applying migration ${migration.id} (${file})…`);
    await migration.up(db);
    await db
      .collection<{ _id: string; appliedAt: Date }>(SCHEMA_MIGRATIONS_COLLECTION)
      .insertOne({
        _id: migration.id,
        appliedAt: new Date(),
      });
    applied.add(migration.id);
    appliedNow.push(migration.id);
    console.log(`Applied ${migration.id}`);
  }

  return appliedNow;
};
