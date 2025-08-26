import { EntityType } from "generated/prisma";


export type MediaIdentifier = {

    entityId: string;
    entityType: EntityType;
    mediaPurpose?: string
}