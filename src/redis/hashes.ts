const USERS = 'USERS';
const SESSIONS = 'SESSIONS';
const DRINKS_CONSUMED = 'DRINKS_CONSUMED';
const QR_CODE = 'QR_CODE';

export const HASHES3 = {
  USERS,
  SESSIONS,
  DRINKS_CONSUMED,
  QR_CODE,
} as const;

export const HASHES = {
  USER_SESSION: (userId: string) => `user:${userId}:session`,

  LADIES_NIGHT: {
    USER: {
      HASH: (userId: string) => `ladies_night:user:${userId}`,
      ALL_HASH: () => 'ladies_night:user:*',
      USER_DRINKS_CONSUMED: () => 'user_drinks_consumed',
      USER_CODE: () => 'user_code',
      SOCKET_ID: () => 'socket_id',
    },

    CODES: () => 'ladies_night:codes',

    DATE: {
      HASH: () => 'ladies_night:date',
      CRON_START_DATE: () => 'start_date',
      CRON_END_DATE: () => 'end_date',
    },
  },

  SPINNING_WHEEL: {
    USER:{
      HASH: (userId: string) => `spinning_wheel:user:${userId}`,
      ALL_HASH: () => 'spinning_wheel:user:*',
      USER_CODE: () => 'user_code',
      USER_REDEEMED_CODE: () => 'code_redeemed',
      REWARD_ID: () => 'reward_id',
    },
    DATE: {
      HASH: () => 'spinning_wheel:date',
      START_DATE: () => 'start_date',
      END_DATE: () => 'end_date',
      NAME : () => 'name',
    },

    CODES : () => 'spinning_wheel:codes',

    REWARDS : {
      REWARD_NAME: () => `spinning_wheel:rewards`,
    }
  },
} as const;

export type HASHES3 = keyof typeof HASHES3;
