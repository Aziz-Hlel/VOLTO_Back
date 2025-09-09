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

@Injectable()
export class BullmqService2 implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly ladiesNightService: LadiesNightService,
  ) {}

  private readonly logger = new Logger(BullmqService2.name);

  static queueName = 'stats-scheduler';
  private statsQueue: Queue;
  private statsWorker: Worker;

  private initStatsQueue = () => {
    this.statsQueue = new Queue(BullmqService2.queueName, {
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
  };

  private initStatsWorker() {
    this.statsWorker = new Worker(
      BullmqService2.queueName,
      async (job: Job) => {
        await this.ladiesNightJob();
      },
      {
        connection: this.redis,
        concurrency: 2,
      },
    );

    this.statsWorker.on('completed', (job) => {
      this.logger.log(
        `✅ Event job completed: ${job.data.eventName} ${job.data.action}`,
      );
    });

    this.statsWorker.on('failed', (job, err) => {
      this.logger.error(
        `❌ Event job failed: ${job?.data?.eventName} - ${err.message}`,
      );
    });

    this.statsWorker.on('error', (err) => {
      this.logger.error('BullMQ Worker error:', err);
    });
  }

  private ladiesNightJob = async () => {
    await this.ladiesNightService.saveStatsToDb();
  };

  private initLadiesNightCronJob = () => {
    this.statsQueue.add(
      BullmqService2.queueName,
      {},
      {
        repeat: {
          pattern: '*/15 * * * *',
          utc: true,
        },
        jobId: 'ladiesNightCronJob',
      },
    );
  };

  async onModuleInit() {
    this.initStatsQueue();
    this.initStatsWorker();
    this.initLadiesNightCronJob();
  }

  async onModuleDestroy() {}
}
