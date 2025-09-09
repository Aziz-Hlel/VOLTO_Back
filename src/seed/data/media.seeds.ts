import { EntityType, Media, MediaPurpose, MediaStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type IMediaType = Omit<Media, 'createdAt' | 'updatedAt'>;

export const LadiesNightThumbnail = (entityId: string): IMediaType => ({
  s3Key: 'events/ladies-night-wallpaper.jpg',
  mimeType: 'image/jpeg',
  fileSize: 136877,
  fileType: '.jpg',
  originalName: 'ladies-night-wallpaper.jpg',
  entityType: EntityType.EVENT,
  mediaPurpose: MediaPurpose.THUMBNAIL,
  status: MediaStatus.CONFIRMED,
  confirmedAt: null,
  entityId: entityId,
});

export const LadiesNightVideo = (entityId: string): IMediaType => ({
  s3Key: 'events/volto-brunch-1.mp4',
  mimeType: 'video/mp4',
  fileSize: 1926697,
  fileType: '.mp4',
  originalName: 'volto-brunch-1.mp4',
  entityType: EntityType.EVENT,
  mediaPurpose: MediaPurpose.VIDEO,
  status: MediaStatus.CONFIRMED,
  confirmedAt: null,
  entityId: entityId,
});

export const hookasNightThumbnail = (entityId: string): IMediaType => ({
  s3Key: 'events/hookah-night.jpg',
  mimeType: 'image/jpeg',
  fileSize: 56160,
  fileType: '.jpg',
  originalName: 'hookah-night.jpg',
  entityType: EntityType.EVENT,
  mediaPurpose: MediaPurpose.THUMBNAIL,
  status: MediaStatus.CONFIRMED,
  confirmedAt: null,
  entityId: entityId,
});

export const hookasNightVideo = (entityId: string): IMediaType => ({
  s3Key: 'events/volto-video.mp4',
  mimeType: 'video/mp4',
  fileSize: 3769471,
  fileType: '.mp4',
  originalName: 'volto-video.mp4',
  entityType: EntityType.EVENT,
  mediaPurpose: MediaPurpose.VIDEO,
  status: MediaStatus.CONFIRMED,
  confirmedAt: null,
  entityId: entityId,
});

export const fridayBrunchThumbnail = (entityId: string): IMediaType => ({
  s3Key: 'events/brunch-wallpaper.jpg',
  mimeType: 'image/jpeg',
  fileSize: 1231980,
  fileType: '.jpg',
  originalName: 'volto-brunch-1.mp4',
  entityType: EntityType.EVENT,
  mediaPurpose: MediaPurpose.THUMBNAIL,
  status: MediaStatus.CONFIRMED,
  confirmedAt: null,
  entityId: entityId,
});

export const fridayBrunchVideo = (entityId: string): IMediaType => ({
  s3Key: 'events/volto-video2.mp4',
  mimeType: 'video/mp4',
  fileSize: 3769471,
  fileType: '.mp4',
  originalName: 'volto-video2.mp4',
  entityType: EntityType.EVENT,
  mediaPurpose: MediaPurpose.VIDEO,
  status: MediaStatus.CONFIRMED,
  confirmedAt: null,
  entityId: entityId,
});

export const newYearEveThumbnail = (entityId: string): IMediaType => ({
  s3Key: 'events/new-year-event.jpg',
  mimeType: 'image/jpeg',
  fileSize: 65257,
  fileType: '.jpg',
  originalName: 'new-year-event.jpg',
  entityType: EntityType.EVENT,
  mediaPurpose: MediaPurpose.THUMBNAIL,
  status: MediaStatus.CONFIRMED,
  confirmedAt: null,
  entityId: entityId,
});

export const newYearEveVideo = (entityId: string): IMediaType => ({
  s3Key: 'events/volto-video3.mp4',
  mimeType: 'video/mp4',
  fileSize: 3769471,
  fileType: '.mp4',
  originalName: 'volto-video3.mp4',
  entityType: EntityType.EVENT,
  mediaPurpose: MediaPurpose.VIDEO,
  status: MediaStatus.CONFIRMED,
  confirmedAt: null,
  entityId: entityId,
});

export const seedMedia = async (media: IMediaType) => {
return  await prisma.media.upsert({
    where: { s3Key: media.s3Key },
    update: media,
    create: media,
  });
};
