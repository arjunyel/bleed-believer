import type { InjectableTarget } from '../injectable/index.js';

import { INJECT } from '../inject/index.js';
import { INJECTABLE } from '../injectable/index.js';

export class DIContainer {
    #deps: {
        id: symbol;
        value: any;
    }[] = [];

    assign<T>(target: InjectableTarget<T, any[]>, value: T): void {
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

    create<T>(
        target: InjectableTarget<T, any[]>,
        ...args: ConstructorParameters<InjectableTarget<T, any[]>>
    ): T  {
        const o = new target(...args) as any;
        const meta = INJECT.get(target, true);

        if (meta) {
            meta.deps.forEach(x => {
                const dep = this.#deps.find(y => x.target.id === y.id);
                if (dep) {
                    const proto = Object.getPrototypeOf(dep.value);
                    if (proto.constructor.name !== 'Object') {
                        o[x.key] = dep.value;
                    } else {
                        o[x.key] = (this.create as any)(x.constr, ...x.args);
                        Object
                            .entries(dep.value)
                            .forEach(([ key, value ]) => {
                                if (typeof value === 'function') {
                                    value.bind(o);
                                }
    
                                o[x.key][key] = value;
                            });
    
                    }
                } else {
                    o[x.key] = (this.create as any)(x.constr, ...x.args);
                }
            });
        }

        return o;
    }
}