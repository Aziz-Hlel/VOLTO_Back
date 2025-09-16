

export type IsSpinningWheelAvailableResponse =
    | { isAvailable: false,name:string|null,startDate?:Date }
    | { isAvailable: true; name: string|null; startDate: Date; endDate: Date };
