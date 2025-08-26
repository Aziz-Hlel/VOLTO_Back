import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { IStorageProvider } from "./interfaces/storage.interface";
import ENV from "src/config/env";
import { GeneratePresignedUrlParams } from "./types/generatePresignedUrlParams";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";



export class MinioStorage implements IStorageProvider {

    readonly s3Client = new S3Client({
        region: ENV.MINIO_Region!,
        endpoint: ENV.MINIO_ENDPOINT!,
        credentials: {
            accessKeyId: ENV.MINIO_ACCESS_KEY!,
            secretAccessKey: ENV.MINIO_SECRET_KEY!,
        },
        forcePathStyle: true,

    });

    async generatePresignedUrl({ fileKey, mimeType, expiresIn }: GeneratePresignedUrlParams): Promise<string> {


        const command = new PutObjectCommand({
            Bucket: ENV.MINIO_BUCKET!,
            Key: fileKey,
            ContentType: mimeType,
            // ContentDisposition: 'attachment', // Security: prevent content-type switching
        });

        const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn, });

        return signedUrl;
    }



}