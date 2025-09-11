import {
  EntityType,
  Event,
  EventType,
  Media,
  MediaStatus,
  PrismaClient,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  fridayBrunchThumbnail,
  fridayBrunchVideo,
  hookasNightThumbnail,
  hookasNightVideo,
  LadiesNightThumbnail,
  LadiesNightVideo,
  newYearEveThumbnail,
  newYearEveVideo,
  seedMedia,
} from './media.seeds';

  const prisma = new PrismaClient();

type IMediaType = Omit<Media, 'id' | 'createdAt' | 'updatedAt'>;

type IEventSeeds = Omit<Event, 'createdAt' | 'updatedAt'> & {
  thumnail: IMediaType;
  video: IMediaType;
};

const now = new Date();

const oneMinute = 60 * 1000;
const oneMinuteLater = new Date(now.getTime() + oneMinute);
const fiveMinuteLater = new Date(now.getTime() + oneMinute * 61);

const eventSeeds: IEventSeeds[] = [
  {
    id: '5e3b7f1c-2d4a-4f6e-9a8b-1c2d3e4f5a6b',
    name: 'Ladies Night',
    description: 'Ladies Night',
    startDate: null,
    endDate: null,
    cronStartDate: '30 15 * * 4',
    cronEndDate: '0 16 * * 4',
    type: EventType.WEEKLY,
    isLadiesNight: true,
    thumnail: LadiesNightThumbnail('5e3b7f1c-2d4a-4f6e-9a8b-1c2d3e4f5a6b'),
    video: LadiesNightVideo('5e3b7f1c-2d4a-4f6e-9a8b-1c2d3e4f5a6b'),
  },
  {
    id: '8a1c3d5e-7f2b-4a6d-9e1c-3b4f5a6d7e8f',
    name: 'Friday Brunch',
    description: 'Friday Brunch',
    startDate: null,
    endDate: null,
    cronStartDate: '0 14 * * 5',
    cronEndDate: '0 17 * * 5',
    type: EventType.WEEKLY,
    isLadiesNight: false,
    thumnail: fridayBrunchThumbnail('8a1c3d5e-7f2b-4a6d-9e1c-3b4f5a6d7e8f'),
    video: fridayBrunchVideo('8a1c3d5e-7f2b-4a6d-9e1c-3b4f5a6d7e8f'),
  },
  {
    id: '3f7a1d5c-2b6e-4a8f-9c1b-5d2e3f4a6b7c',
    name: 'Hookas Night',
    description: 'Hookas Night',
    startDate: null,
    endDate: null,
    cronStartDate: '0 17 * * 1',
    cronEndDate: '0 02 * * 2',
    type: EventType.WEEKLY,
    isLadiesNight: false,
    thumnail: hookasNightThumbnail('3f7a1d5c-2b6e-4a8f-9c1b-5d2e3f4a6b7c'),
    video: hookasNightVideo('3f7a1d5c-2b6e-4a8f-9c1b-5d2e3f4a6b7c'),
  },
  {
    id: 'b6d1e3f4-5a7c-4f2b-8e1a-9c3b2d4f5a6e',
    name: "New Year's Eve",
    description: "New Year's Eve",
    startDate: new Date('2025-12-31T00:00:00.000Z'),
    endDate: new Date('2025-12-31T23:59:59.999Z'),
    cronStartDate: null,
    cronEndDate: null,
    type: EventType.SPECIAL,
    isLadiesNight: false,
    thumnail: newYearEveThumbnail('b6d1e3f4-5a7c-4f2b-8e1a-9c3b2d4f5a6e'),
    video: newYearEveVideo('b6d1e3f4-5a7c-4f2b-8e1a-9c3b2d4f5a6e'),
  },
];

const seedEvents = async () => {
  for (const eventWithMedia of eventSeeds) {
    const { thumnail, video, ...event } = eventWithMedia;
    await seedMedia(thumnail);
    await seedMedia(video);

    await prisma.event.upsert({
      where: { name: event.name },
      update: event,
      create: event,
    });
  }
};

export default seedEvents;
