import seedrandom from 'seedrandom';

export class SeededRandom {
  private rng: seedrandom.PRNG;

  constructor(seed: string) {
    this.rng = seedrandom(seed);
  }

  // Returns float between 0 and 1
  random(): number {
    return this.rng();
  }

  // Returns integer between min and max (inclusive)
  int(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  // Returns float between min and max
  float(min: number, max: number): number {
    return this.random() * (max - min) + min;
  }

  // Pick random element from array
  pick<T>(array: readonly T[]): T {
    return array[this.int(0, array.length - 1)];
  }

  // Pick n random elements from array (without replacement)
  pickN<T>(array: readonly T[], n: number): T[] {
    const copy = [...array];
    const result: T[] = [];
    const count = Math.min(n, copy.length);

    for (let i = 0; i < count; i++) {
      const idx = this.int(0, copy.length - 1);
      result.push(copy[idx]);
      copy.splice(idx, 1);
    }

    return result;
  }

  // Gaussian distribution for more realistic variance
  gaussian(mean: number, stdDev: number): number {
    const u1 = this.random();
    const u2 = this.random();
    const z = Math.sqrt(-2 * Math.log(u1 || 0.0001)) * Math.cos(2 * Math.PI * u2);
    return mean + z * stdDev;
  }

  // Returns a value with day-of-week variance (0 = Sunday)
  withDayOfWeekVariance(baseValue: number, dayOfWeek: number, weekdayMultiplier = 1.2): number {
    // Weekdays (Mon-Fri) get higher values, weekends lower
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const multiplier = isWeekend ? 1 / weekdayMultiplier : weekdayMultiplier;
    return baseValue * multiplier;
  }
}

// Create a hash string for consistent seeding
export function createSeed(...parts: (string | number)[]): string {
  return parts.join(':');
}
