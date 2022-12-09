export interface InjectableTarget<T, A extends any[]> {
    new(...args: A): T;
}
