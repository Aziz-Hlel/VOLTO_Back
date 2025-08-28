import { EntityType } from "@prisma/client";


export type MediaIdentifier = {

    entityId: string;
    entityType: EntityType;
    mediaPurpose?: string
}