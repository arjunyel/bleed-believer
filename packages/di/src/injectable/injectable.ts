import { MetaManager } from '@bleed-believer/meta';

import type { InjectableMeta, InjectableTarget } from './interfaces/index.js';

export const INJECTABLE = new MetaManager<InjectableMeta<any>>('@bleed-beliecer/di:injectable');
export function Injectable<T, A extends any[] = []>() {
    return (
        target: InjectableTarget<T, A>
    ) => {
        INJECTABLE.set(target, {
            id: Symbol(),
            name: target.name
        });
    };
}