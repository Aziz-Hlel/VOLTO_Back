import { EntityType, MediaPurpose } from '@prisma/client';

export type MediaIdentifier = {
  entityId: string;
  entityType: EntityType;
  mediaPurpose: MediaPurpose;
};
