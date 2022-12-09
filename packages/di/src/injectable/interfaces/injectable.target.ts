import type { InjectableMeta } from './injectable.meta.js';

export interface InjectableTarget<T, A extends any[] = []> {
    new(...args: A): T;
}
