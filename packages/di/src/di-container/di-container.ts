import type { InjectableTarget } from '../injectable/index.js';

import { INJECT } from '../inject/index.js';
import { INJECTABLE } from '../injectable/index.js';

export class DIContainer {
    #deps: { id: symbol, value: any }[] = [];

    assign<T>(target: InjectableTarget<T>, value: T): void {
        const meta = INJECTABLE.get(target, true);
        if (!meta) {
            throw new Error('The target provided isn\'t an injectable class');
        }

        const found = this.#deps.find(({ id }) => id === meta.id);
        if (found) {
            found.value = value;
        } else {
            this.#deps.push({ id: meta.id, value });
        }
    }

    create<T, A extends any[]>(
        target: { new(...args: A): T },
        ...args: A
    ): T  {
        // console.log('typeof "target" ->', typeof target);
        const o = new target(...args) as any;
        const meta = INJECT.get(target, true);

        if (meta) {
            meta.deps.forEach(x => {
                const dep = this.#deps.find(y => x.target.id === y.id);
                o[x.key] = (this.create as any)(x.constr, ...x.args);
                if (dep) {
                    Object
                        .entries(dep.value)
                        .forEach(([ key, value ]) => {
                            if (typeof value === 'function') {
                                value.bind(o);
                            }

                            o[x.key][key] = value;
                        });
                }
            });
        }

        return o;
    }
}