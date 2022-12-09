import test from 'ava';
import { Injectable } from '../injectable/injectable.js';

import { INJECT, Inject } from './inject.js';

test('Case 01', t => {
    interface Logger {
        log(...args: string[]): void;
    }

    interface Random {
        random(min: number, max: number): number;
    }

    @Injectable()
    class SystemLogger implements Logger {
        log(...input: string[]): void {
            console.log(...input);
        }
    }

    @Injectable()
    class DonRandom implements Random {
        random(min: number, max: number): number {
            return (Math.random() * (max - min)) + min;
        }
    }

    class Program {
        @Inject(SystemLogger)
        declare logger: Logger;
        
        @Inject(DonRandom)
        declare random: Random;
    }

    const meta = INJECT.get(Program);
    t.is(typeof meta.id, 'symbol');
    t.is(meta.deps[0].key, 'logger');
    t.is(meta.deps[0].target.name, 'SystemLogger');
    t.is(typeof meta.deps[0].target.id, 'symbol');
    t.is(meta.deps[1].key, 'random');
    t.is(meta.deps[1].target.name, 'DonRandom');
    t.is(typeof meta.deps[1].target.id, 'symbol');
});
