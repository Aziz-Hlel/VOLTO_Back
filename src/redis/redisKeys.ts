const REDIS_KEYS = {
  isLadiesNightAvailable: () => 'isLadiesNightAvailable',
  isSpinningWheelAvailable: () => 'isSpinningWheelAvailable',
} as const;

export default REDIS_KEYS;
