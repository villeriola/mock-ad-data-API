import { describe, it, expect } from 'vitest';
import { SeededRandom, createSeed } from '../src/utils/seeded-random.js';

describe('SeededRandom', () => {
  it('produces consistent results with same seed', () => {
    const rng1 = new SeededRandom('test-seed');
    const rng2 = new SeededRandom('test-seed');

    const values1 = [rng1.random(), rng1.random(), rng1.random()];
    const values2 = [rng2.random(), rng2.random(), rng2.random()];

    expect(values1).toEqual(values2);
  });

  it('produces different results with different seeds', () => {
    const rng1 = new SeededRandom('seed-1');
    const rng2 = new SeededRandom('seed-2');

    expect(rng1.random()).not.toEqual(rng2.random());
  });

  it('int() returns values within range', () => {
    const rng = new SeededRandom('test');

    for (let i = 0; i < 100; i++) {
      const value = rng.int(5, 10);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(10);
    }
  });

  it('float() returns values within range', () => {
    const rng = new SeededRandom('test');

    for (let i = 0; i < 100; i++) {
      const value = rng.float(1.5, 3.5);
      expect(value).toBeGreaterThanOrEqual(1.5);
      expect(value).toBeLessThanOrEqual(3.5);
    }
  });

  it('pick() selects from array consistently', () => {
    const rng1 = new SeededRandom('pick-test');
    const rng2 = new SeededRandom('pick-test');
    const options = ['a', 'b', 'c', 'd', 'e'] as const;

    const picks1 = [rng1.pick(options), rng1.pick(options), rng1.pick(options)];
    const picks2 = [rng2.pick(options), rng2.pick(options), rng2.pick(options)];

    expect(picks1).toEqual(picks2);
  });
});

describe('createSeed', () => {
  it('creates consistent seed strings', () => {
    const seed1 = createSeed('account', '123', 'campaign', '456');
    const seed2 = createSeed('account', '123', 'campaign', '456');

    expect(seed1).toEqual(seed2);
    expect(seed1).toEqual('account:123:campaign:456');
  });

  it('different inputs produce different seeds', () => {
    const seed1 = createSeed('a', 'b');
    const seed2 = createSeed('a', 'c');

    expect(seed1).not.toEqual(seed2);
  });
});
