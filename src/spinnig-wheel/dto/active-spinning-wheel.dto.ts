

export type IsSpinningWheelAvailableResponse =
    | { isAvailable: false }
    | { isAvailable: true; name: string|null; startDate: Date; endDate: Date };
