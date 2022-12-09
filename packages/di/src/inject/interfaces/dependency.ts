import type { InjectableTarget } from '../../injectable/index.js';

export interface Dependency<T, K extends keyof T> {
    key: K;
    args: unknown[];
    constr: InjectableTarget<T>;
    target: T[K];
}