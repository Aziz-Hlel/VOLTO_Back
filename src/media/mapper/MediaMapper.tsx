import { Media, MediaStatus } from "generated/prisma";
import { PreSignedUrlRequest } from "src/s3/dto/preSignedUrl.dto";
import { createPendingMedia } from "../dto/createPendingMedia";


export class MediaMapper {

    static toMediaEntity(preSignedUrlRequest: createPendingMedia): Media {

        const media: Media = {
            s3Key: preSignedUrlRequest.s3Key,
            fileType: preSignedUrlRequest.fileType,
            originalName: preSignedUrlRequest.originalName,
            mimeType: preSignedUrlRequest.mimeType,
            fileSize: preSignedUrlRequest.fileSize, // Ensure fileSize can be null
            status: MediaStatus.PENDING,

            entityType: preSignedUrlRequest.entityType,
            entityId: null,
            mediaPurpose: preSignedUrlRequest.mediaPurpose ?? null,

            createdAt: new Date(),
            updatedAt: new Date(), // Add updatedAt
            confirmedAt: null, // Add confirmedAt, default to null
        };

        return media;

    }
} 