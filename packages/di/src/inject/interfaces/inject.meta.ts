import type { Dependency } from './dependency.js';

export interface InjectMeta<T> {
    id: symbol;
    deps: Dependency<T, keyof T>[];
}