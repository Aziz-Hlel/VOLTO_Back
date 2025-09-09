FROM minio/mc:latest

ENV MINIO_ALIAS=local
ENV MINIO_URL=http://minio:9000
ENV MINIO_BUCKET=my-bucket
ENV MINIO_ACCESS_KEY=minioadmin
ENV MINIO_SECRET_KEY=minioadmin

COPY seed /seed

# Create an internal init script for readability
RUN echo '#!/bin/sh\n\
echo "Waiting for MinIO to be ready..."\n\
until mc alias set $MINIO_ALIAS $MINIO_URL $MINIO_ACCESS_KEY $MINIO_SECRET_KEY; do\n\
  echo "Retrying..."; sleep 2;\n\
done\n\
echo "Creating bucket $MINIO_BUCKET if not exists..."\n\
mc mb --ignore-existing $MINIO_ALIAS/$MINIO_BUCKET\n\
echo "Setting public download access for $MINIO_BUCKET..."\n\
mc anonymous set download $MINIO_ALIAS/$MINIO_BUCKET\n\
echo "Uploading seed files..."\n\
mc cp --recursive /seed/* $MINIO_ALIAS/$MINIO_BUCKET/ || echo "No seed files found."\n\
echo "Initialization complete."' > /usr/local/bin/init-minio.sh \
&& chmod +x /usr/local/bin/init-minio.sh

ENTRYPOINT ["/usr/local/bin/init-minio.sh"]
