import { Event, EventType } from '@prisma/client';

export const createEventRequestBody: IcreateEventRequestBody = {
  name: 'Test Event',
  type: EventType.WEEKLY,
  description: 'This is a test event',
  startDate: new Date('2025-08-01T00:00:00.000Z'),
  endDate: new Date('2025-08-31T23:59:59.999Z'),
  isLadiesNight: false,
  thumbnailKey: 'test-thumbnail-key',
  videoKey: 'test-video-key',
};

export type IcreateEventRequestBody = Omit<
  Event,
  'id' | 'createdAt' | 'updatedAt'
> & { thumbnailKey: string; videoKey: string };
