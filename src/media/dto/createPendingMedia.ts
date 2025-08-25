import { PreSignedUrlRequest } from "src/s3/dto/preSignedUrl.dto";


export class createPendingMedia extends PreSignedUrlRequest {

    s3Key: string

}