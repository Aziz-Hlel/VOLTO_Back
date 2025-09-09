import { Prisma } from '@prisma/client';

type Worker = Prisma.WorkerGetPayload<{}>;

export class WorkerMapper {
  static toResponse(worker: Worker) {
    return {
      id: worker.id,
      name: worker.name,
      occupation: worker.occupation,
      ranking: worker.ranking,
    };
  }
}
