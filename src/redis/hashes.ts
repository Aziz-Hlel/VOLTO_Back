
const USERS = "USERS";
const SESSIONS = "SESSIONS";
const DRINKS_CONSUMED = "DRINKS_CONSUMED";
const QR_CODE = "QR_CODE";

export const HASHES = {
    USERS,
    SESSIONS,
    DRINKS_CONSUMED,
    QR_CODE
    
} as const


export type HASHES = keyof typeof HASHES;
