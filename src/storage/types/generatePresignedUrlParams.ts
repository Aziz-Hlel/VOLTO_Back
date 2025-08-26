import { FileType } from "../dto/preSignedUrl.dto"


export type GeneratePresignedUrlParams = {
    fileKey: string,
    mimeType: string,
    expiresIn: number,
}