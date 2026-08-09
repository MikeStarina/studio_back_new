#!/usr/bin/env bash
# Run once on a fresh Ubuntu 24.04 VM (API or FE).
set -euo pipefail

ROLE="${1:-api}" # api | fe

sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sudo sh
fi

sudo usermod -aG docker "${USER}"

if [[ "${ROLE}" == "api" ]]; then
  sudo mkdir -p /opt/studio-api
  sudo chown "${USER}:${USER}" /opt/studio-api
  # MongoDB Database Tools (mongodump / mongorestore) — install from MongoDB docs if missing
  echo "API role: install mongodb-database-tools + mongosh if you need dump/restore on this host."
else
  sudo mkdir -p /opt/studio-fe
  sudo chown "${USER}:${USER}" /opt/studio-fe
fi

echo "Done. Re-login (or newgrp docker) so docker works without sudo."
echo "Next: configure GitHub Actions secrets and run the deploy workflow."
