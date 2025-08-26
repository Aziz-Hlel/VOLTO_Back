
import { Event } from 'generated/prisma';


export class EventMapper {

    static toResponse(event: Event) {
        return {
            id: event.id,
            name: event.name,
            type: event.type,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            isLadiesNight: event.isLadiesNight,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
        }
    }
}