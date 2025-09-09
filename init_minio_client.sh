#!/bin/sh
set -e


echo "Waiting for MinIO to be ready..."
until mc alias set local http://minio:${MINIO_PORT} "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY"; do
  echo "Retrying..."
  sleep 2
done

echo "Creating bucket \"$MINIO_BUCKET\" if not exists..."
mc mb --ignore-existing local/$MINIO_BUCKET

echo "Setting public download access for \"$MINIO_BUCKET\"..."
mc anonymous set download local/$MINIO_BUCKET

echo "Uploading seed files..."
mc cp --recursive ./seed/* local/$MINIO_BUCKET/ || echo "No seed files found when uploading seed files to minio❗❗❗"

echo "Initialization complete."

