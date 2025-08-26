import ENV from "src/config/env";
import { IStorageService } from "./interfaces/storage.interface";
import path from "path";
import { FileType, PreSignedUrlRequest } from "./dto/preSignedUrl.dto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PreSignedUrlResponse } from "./dto/PreSignedUrlResponse";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StorageService } from "./storage.service";
import { MediaService } from "src/media/media.service";
import { StorageMapper } from "./mapper/StorageMapper";
import { GeneratePresignedUrlParams } from "./types/generatePresignedUrlParams";





export class AwsS3StorageService implements IStorageService {


    constructor(public mediaService: MediaService) {
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


    generateFileKey(fileName: string): string {
        const ext = path.extname(fileName);
        const baseName = path.basename(fileName, ext);
        const safeBase = baseName.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50);
        const timestamp = Date.now();
        return `${safeBase}-${timestamp}${ext}`;
    }



    async generatePresignedUrl({ fileKey, fileType }: GeneratePresignedUrlParams): Promise<string> {

        const expiresIn = 3600;

        const command = new PutObjectCommand({
            Bucket: ENV.AWS_S3_BUCKET,
            Key: fileKey,
            ContentType: fileType,
            ContentDisposition: 'attachment', // Security: prevent content-type switching
        });

        const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn, });

        return signedUrl;

    }



}