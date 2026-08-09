#!/usr/bin/env bash
# Usage (on a machine that can reach source Mongo, then restore from API VM in YC VPC):
#   SOURCE_URI='mongodb://...' TARGET_URI='mongodb://...@....:27018/studio?...' ./deploy/migrate-db.sh
set -euo pipefail

SOURCE_URI="${SOURCE_URI:?set SOURCE_URI}"
TARGET_URI="${TARGET_URI:?set TARGET_URI}"
ARCHIVE="${ARCHIVE:-/tmp/studio-migrate-$(date +%F-%H%M).archive.gz}"

echo "Dumping ${SOURCE_URI} -> ${ARCHIVE}"
mongodump --uri="${SOURCE_URI}" --db=studio --gzip --archive="${ARCHIVE}"

echo "Restoring into ${TARGET_URI}"
mongorestore --uri="${TARGET_URI}" --gzip --archive="${ARCHIVE}" --drop

echo "Done. Verify counts with mongosh on both sides."
