import { S3Client } from "@aws-sdk/client-s3";
import { FileType, PreSignedUrlRequest } from "../dto/preSignedUrl.dto";
import { PreSignedUrlResponse } from "../dto/PreSignedUrlResponse";
import { GeneratePresignedUrlParams } from "../types/generatePresignedUrlParams";


export interface IStorageService {

    s3Client: S3Client;

    generatePresignedUrl(params: GeneratePresignedUrlParams): Promise<string>;

}