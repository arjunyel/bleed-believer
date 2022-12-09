import test from 'ava';
import { DIContainer } from './di-container.js';

import { DonRandom, Program, SystemSender } from './case-01.example.js';
import type { Sender, Random } from './case-01.example.js';

test('Expect to inject the default dependecy', t => {
    const container = new DIContainer();
    const obj = container.create(Program);
    obj.execute();
    t.pass();
});

test('Expect to inject a fake "SystemSender"', t => {
    const container = new DIContainer();
    container.assign<Sender>(SystemSender, {
        log() { return 'pendejo' }
    })
    
    const obj = container.create(Program);
    const message = obj.execute();
    t.is(message, 'pendejo');
});

test('Expect to inject a fake "DonRandom"', t => {
    const container = new DIContainer();
    container.assign<Random>(DonRandom, {
        random() {
            return 5;
        },
    })
    
    const obj = container.create(Program);
    const message = obj.execute();
    t.is(message, 'value: 5');
});
