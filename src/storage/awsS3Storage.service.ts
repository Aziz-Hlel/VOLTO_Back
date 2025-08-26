import ENV from "src/config/env";
import { IStorageProvider } from "./interfaces/storage.interface";
import path from "path";
import { FileType, PreSignedUrlRequest } from "./dto/preSignedUrl.dto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PreSignedUrlResponse } from "./dto/PreSignedUrlResponse";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StorageService } from "./storage.service";
import { MediaService } from "src/media/media.service";
import { StorageMapper } from "./mapper/StorageMapper";
import { GeneratePresignedUrlParams } from "./types/generatePresignedUrlParams";





export class AwsS3Storage implements IStorageProvider {


    constructor() {
        // Initialize AWS S3 client here
        if (ENV.NODE_ENV !== 'production')
            throw new Error('AwsS3StorageService can only be used in production environment');
    }




    readonly s3Client = new S3Client({
        region: ENV.AWS_REGION,
        credentials: {
            accessKeyId: ENV.AWS_ACCESS_KEY_ID,
            secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
        },

    });


    async generatePresignedUrl({ fileKey, mimeType: fileType, expiresIn }: GeneratePresignedUrlParams): Promise<string> {


        const command = new PutObjectCommand({
            Bucket: ENV.AWS_S3_BUCKET,
            Key: fileKey,
            ContentType: fileType,
        });

        const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn, });

        return signedUrl;

    }



}