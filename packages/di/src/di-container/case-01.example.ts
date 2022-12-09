import { cursorTo } from 'readline';
import { Inject } from '../inject/index.js';
import { Injectable } from '../injectable/index.js';

export interface Sender {
    log(...args: string[]): string;
}

export interface Random {
    random(min: number, max: number): number;
}

@Injectable()
export class SystemSender implements Sender {
    log(...input: string[]): string {
        return input.reduce((prev, curr, i) => {
            return i > 0
                ?   `${prev} ${curr}`
                :   curr
            },
            ''
        );
    }
}

@Injectable()
export class DonRandom implements Random {
    random(min: number, max: number): number {
        return (Math.random() * (max - min)) + min;
    }
}

export class Program {
    @Inject(SystemSender)
    declare logger: Sender;
    
    @Inject(DonRandom)
    declare random: Random;

    execute(): string {
        const value = this.random.random(1, 10);
        return this.logger.log(`value: ${value}`);
    }
}