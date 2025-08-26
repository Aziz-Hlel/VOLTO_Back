import { S3Client } from "@aws-sdk/client-s3";
import { FileType, PreSignedUrlRequest } from "./dto/preSignedUrl.dto";
import { PreSignedUrlResponse } from "./dto/PreSignedUrlResponse";
import { IStorageService } from "./interfaces/storage.interface";
import ENV from "src/config/env";
import { GeneratePresignedUrlParams } from "./types/generatePresignedUrlParams";



export class MinioStorageService implements IStorageService {

    readonly s3Client = new S3Client({
        region: ENV.MINIO_Region!,
        endpoint: ENV.MINIO_ENDPOINT!,
        credentials: {
            accessKeyId: ENV.MINIO_ACCESS_KEY!,
            secretAccessKey: ENV.MINIO_SECRET_KEY!,
        },
        forcePathStyle: true,

    });

    async generatePresignedUrl({ fileKey, fileType }: GeneratePresignedUrlParams): Promise<string> {
        throw new Error("Method not implemented.");
    }



}