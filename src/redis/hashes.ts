
const USERS = "USERS";
const SESSIONS = "SESSIONS";
const DRINKS_CONSUMED = "DRINKS_CONSUMED";
const QR_CODE = "QR_CODE";

export const HASHES3 = {
    USERS,
    SESSIONS,
    DRINKS_CONSUMED,
    QR_CODE

} as const


export const HASHES = {
    USER_SESSION: (userId: string) => `user:${userId}:session`,
    LADIES_NIGHT: {
        CODE_TO_USER: () => "LADIES_NIGHT:CODE_TO_USER",
        USER_TO_CODE: () => "LADIES_NIGHT:USER_TO_CODE",
        USER_DRINKS_CONSUMED: (userId: string) => `ladies_night:${userId}:user_drinks_consumed`,
    },

} as const

export type HASHES3 = keyof typeof HASHES3;
