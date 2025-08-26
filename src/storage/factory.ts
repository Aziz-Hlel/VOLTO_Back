import ENV from "src/config/env";
import { AwsS3Storage } from "./awsS3Storage.service";
import { IStorageProvider } from "./interfaces/storage.interface";
import { MinioStorage } from "./minioStorage.service";



export function createStorageProvider(): IStorageProvider {
    if (ENV.NODE_ENV === "development") {
        return new MinioStorage();
    }
    if (ENV.NODE_ENV === "production" || ENV.NODE_ENV === "stage") {
        return new AwsS3Storage();
    }

    throw new Error(`Unsupported StorageProvider for NODE_ENV: ${ENV.NODE_ENV}`);
}