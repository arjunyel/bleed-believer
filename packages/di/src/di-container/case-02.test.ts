import { rm, writeFile } from 'fs/promises';
import { resolve } from 'path';
import test from 'ava';

import type { Readable, Writable, AppconfigData, OrmconfigData } from './case-02.example.js';
import { Config, Json } from './case-02.example.js';
import { DIContainer } from './di-container.js';

test.before(async () => {
    await writeFile(resolve('./appconfig.json'), '{ "port": 8080, "timeout": 30 }');
    await writeFile(resolve('./ormconfig.json'), '{ "port": 1433, "db": "TEST_DB" }');
});

test.after(async () => {
    await rm(resolve('./appconfig.json'));
    await rm(resolve('./ormconfig.json'));
});

test.serial('Check paths of both dependencies', t => {
    const container = new DIContainer();
    const o = container.create(Config);
    t.true(o.appconfig.path.endsWith('/appconfig.json'));
    t.true(o.ormconfig.path.endsWith('/ormconfig.json'));
});

test.serial('Read files (using original dependencies)', async t => {
    const container = new DIContainer();
    const o = container.create(Config);

    const appconfig = await o.appconfig.read();
    const ormconfig = await o.ormconfig.read();

    t.deepEqual(appconfig, {
        port: 8080,
        timeout: 30
    });
    
    t.deepEqual(ormconfig, {
        port: 1433,
        db: 'TEST_DB'
    });
});

test.serial('Read "files" (using fake classes)', async t => {
    class FakeConfig<T> implements Readable<T>, Writable<T> {
        memory?: T;

        read(): Promise<T> {
            if (this.memory) {
                return Promise.resolve(this.memory);
            } else {
                throw new Error('empty data');
            }
        }
        write(data: T): Promise<void> {
            this.memory = data;
            return Promise.resolve();
        }
    }

    const container = new DIContainer();
    container.assign<Readable<any> & Writable<any>>(Json, new FakeConfig());

    const o = container.create(Config);
    ((o.appconfig as unknown) as FakeConfig<AppconfigData>).memory = {
        port: 666,
        timeout: 666
    };
    const appconfig = await o.appconfig.read();
    t.deepEqual(appconfig, {
        port: 666,
        timeout: 666
    });

    ((o.appconfig as unknown) as FakeConfig<OrmconfigData>).memory = {
        port: 666,
        db: 'HERETIC_ANTHEM'
    };
    const ormconfig = await o.ormconfig.read();
    t.deepEqual(ormconfig, {
        port: 666,
        db: 'HERETIC_ANTHEM'
    });
});
