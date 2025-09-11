

export class UnactiveSpinningWheelResponse {
    isAvailable: boolean;
}

export class ActiveSpinningWheelResponse extends UnactiveSpinningWheelResponse {
    name: string|null;
    startDate: Date;
    endDate: Date;
}
