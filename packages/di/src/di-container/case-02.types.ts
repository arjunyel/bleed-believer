export interface Readable<T> {
    read(path: string): Promise<T>;
}

export interface Writable<T> {
    write(path: string, data: T): Promise<void>;
}
