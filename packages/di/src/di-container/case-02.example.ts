import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

import { Injectable } from '../injectable/index.js';
import { Inject } from '../inject/index.js';

export interface Readable<T> {
    read(): Promise<T>;
}

export interface Writable<T> {
    write(data: T): Promise<void>;
}

export interface AppconfigData {
    port: number;
    timeout: number;
}

export interface OrmconfigData {
    port: number;
    db: string;
}

@Injectable()
export class Json<T> implements Readable<T>, Writable<T> {
    #path: string;
    get path(): string {
        return this.#path;
    }

    constructor(path: string) {
        this.#path = resolve(path);
    }

    async read(): Promise<T> {
        const text = await readFile(this.#path, 'utf-8');
        return JSON.parse(text);
    }

    write(data: T): Promise<void> {
        const text = JSON.stringify(data, null, '  ');
        return writeFile(this.#path, text);
    }
}

export class Config {
    @Inject(Json, './appconfig.json')
    declare appconfig: Json<AppconfigData>;

    @Inject(Json, './ormconfig.json')
    declare ormconfig: Json<AppconfigData>;
}

