import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { LadiesNightService } from 'src/ladies-night/ladies-night.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HASHES } from 'src/redis/hashes';
import REDIS_KEYS from 'src/redis/redisKeys';

interface EventJobData {
  eventId: string;
  eventName: string;
  action: 'START' | 'END';
  eventType: 'ladiesNight' | 'spinWheel';
}

type Handler = (data: EventJobData) => Promise<void>;

@Injectable()
export class BullmqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BullmqService.name);

  private eventQueue: Queue<EventJobData>;
  private eventWorker: Worker<EventJobData>;

  public constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  private initQueue() {
    this.eventQueue = new Queue<EventJobData>('events-scheduler', {
      connection: this.redis,
      defaultJobOptions: {
        removeOnComplete: 50, // Keep last 50 completed jobs for monitoring
        removeOnFail: 100, // Keep last 100 failed jobs for debugging
        attempts: 3, // Retry failed jobs up to 3 times
        backoff: {
          type: 'exponential',
          delay: 5000, // Start with 5 second delay
        },
      },
    });

    this.eventQueue.on('waiting', (job) => {
      this.logger.log(
        `📥 Job ${job.data.eventId} ${job.data.eventName} has been created and is waiting`,
      );
    });
  }

  private initWorker() {
    this.eventWorker = new Worker<EventJobData>(
      'events-scheduler',
      async (job: Job<EventJobData>) => {
        // const jobFunction = this.handlers[job.data.eventType][job.data.action]
        // await jobFunction(job.data);
      },
      {
        connection: this.redis,
        concurrency: 2,
      },
    );

    this.eventWorker.on('completed', (job) => {
      this.logger.log(
        `✅ Event job completed: ${job.data.eventName} ${job.data.action}`,
      );
    });

    this.eventWorker.on('failed', (job, err) => {
      this.logger.error(
        `❌ Event job failed: ${job?.data?.eventName} - ${err.message}`,
      );
    });

    this.eventWorker.on('error', (err) => {
      this.logger.error('BullMQ Worker error:', err);
    });
  }

  ladiesNightJobsExists = async () => {
    const ladiesNightJobStart =
      await this.eventQueue.getJobScheduler('ladiesNight:START');
    const ladiesNightJobEnd =
      await this.eventQueue.getJobScheduler('ladiesNight:END');

    if (ladiesNightJobStart?.pattern && ladiesNightJobEnd?.pattern) return true;

    console.log('ladies night events doesnt exists');
    return false;
  };

  generateCronExpression = (date: Date) => {
    const getMinutes = date.getUTCMinutes();
    const dayOfTheWeek = date.getUTCDay();
    const getHour = date.getUTCHours();

    // return `*/5 * * * * *`;

    return `${getMinutes} ${getHour} * * ${dayOfTheWeek}`;
  };

  createLadiesNightJob = async () => {
    const ladiesNightEvent = await this.prisma.event.findFirst({
      where: {
        isLadiesNight: true,
      },
    });

    if (!ladiesNightEvent)
      throw new Error('Ladies Night event does not exist in the database');

    const startDateCron = this.generateCronExpression(
      ladiesNightEvent.startDate ?? new Date(),
    );
    await this.eventQueue.add(
      'events-scheduler',
      {
        action: 'START',
        eventId: ladiesNightEvent.id,
        eventName: ladiesNightEvent.name,
        eventType: 'ladiesNight',
      },
      {
        repeat: {
          pattern: startDateCron,
          utc: true,
        },
        jobId: 'ladiesNight:START',
      },
    );
    console.log('dirrab l start cron = ', startDateCron);

    const endDateCron = this.generateCronExpression(
      ladiesNightEvent.endDate ?? new Date(),
    ); // ! added new Date() just to go pass the error
    await this.eventQueue.add(
      'events-scheduler',
      {
        action: 'END',
        eventId: ladiesNightEvent.id,
        eventName: ladiesNightEvent.name,
        eventType: 'ladiesNight',
      },
      {
        repeat: {
          pattern: endDateCron,
          utc: true,
        },
        jobId: 'ladiesNight:END',
      },
    );

    console.log('dirrab l end cron = ', endDateCron);
  };

  async delAllJobs() {
    try {
      // Get all job schedulers (repeatable jobs)
      const jobSchedulers = await this.eventQueue.getJobSchedulers();
      this.logger.log(`Found ${jobSchedulers.length} job schedulers to remove`);

      // Remove each job scheduler by its key
      for (const scheduler of jobSchedulers) {
        await this.eventQueue.removeJobScheduler(scheduler.key);
        this.logger.log(`Removed job scheduler: ${scheduler.key}`);
      }

      // Clean up completed and failed jobs
      await this.eventQueue.clean(0, 0, 'completed');
      await this.eventQueue.clean(0, 0, 'failed');
      await this.eventQueue.clean(0, 0, 'active');
      await this.eventQueue.clean(0, 0, 'waiting');

      // Drain remaining jobs
      await this.eventQueue.drain();

      this.logger.log('All jobs deleted successfully');
    } catch (error) {
      this.logger.error('Error deleting jobs:', error);
      throw error;
    }
  }

  async onModuleInit() {
    // throw new Error('Method not implemented.');
    this.initQueue();
    this.initWorker();
    console.log('wiouwww');

    // Remove repeatables
    await this.delAllJobs();
    const jobs = await this.eventQueue.getJobSchedulers();
    console.log('jobs lengths post deletion : ', jobs.length);

    const isLadiesNightJobsExists = await this.ladiesNightJobsExists();

    if (isLadiesNightJobsExists) return;

    await this.createLadiesNightJob();
    const jobSchedulers = await this.eventQueue.getJobSchedulers();

    this.logger.log(`Found ${jobSchedulers.length} job schedulers`);
  }

  onModuleDestroy() {
    throw new Error('Method not implemented.');
  }
}
