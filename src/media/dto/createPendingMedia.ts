import { PreSignedUrlRequest } from 'src/storage/dto/preSignedUrl.dto';

export class createPendingMedia extends PreSignedUrlRequest {
  s3Key: string;
}
