import type { TypedPropertyDecorator } from '../interfaces/index.js';
import type { InjectableTarget } from '../injectable/index.js';
import type { InjectMeta } from './interfaces/inject.meta.js';

import { MetaManager } from '@bleed-believer/meta';

import { INJECTABLE } from '../injectable/index.js';

export const INJECT = new MetaManager<InjectMeta<any>>('@bleed-believer/di:inject');
export function Inject<T, A extends any[]>(target: InjectableTarget<T, A>, ...args: A): TypedPropertyDecorator<T> {
    return (instance, key) => {
        const constructor = instance.constructor as InjectableTarget<T>;
        const dependency = INJECTABLE.get(target, true);
        if (!dependency) {
            throw new Error('The target selected must be an @Injectable() class.');
        }

        const store = INJECT.get(constructor, true) ?? {
            id: Symbol(),
            deps: []
        };

        store.deps.push({
            key,
            args,
            target: dependency as any,
            constr: target,
        });

        INJECT.set(constructor, store);
    }
}