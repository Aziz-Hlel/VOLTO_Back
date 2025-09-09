import { PreSignedUrlResponse } from '../dto/PreSignedUrlResponse';

export class StorageMapper {
  static toPreSignedUrlResponse(
    url: string,
    s3Key: string,
  ): PreSignedUrlResponse {
    const response = new PreSignedUrlResponse();
    response.url = url;
    response.s3Key = s3Key;
    return response;
  }
}
