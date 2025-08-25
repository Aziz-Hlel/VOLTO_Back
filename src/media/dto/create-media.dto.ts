export class CreateMediaDto {
    
    s3Key: string;
    mimeType: string;
    size: number;
    originalName : string;

    entityId: string;
    entityType: string;
    mediaPurpose?: string;

}
