import test from 'ava';

import { INJECTABLE, Injectable } from './injectable.js';

test('Case 01', t => {
    @Injectable()
    class Joder {
    }

    const meta = INJECTABLE.get(Joder);
    t.is(meta.name, 'Joder');
    t.is(typeof meta.id, 'symbol');
});
