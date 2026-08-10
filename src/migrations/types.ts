import type { Db } from "mongodb";

export type Migration = {
  id: string;
  up: (db: Db) => Promise<void>;
};

export const SCHEMA_MIGRATIONS_COLLECTION = "schema_migrations";
