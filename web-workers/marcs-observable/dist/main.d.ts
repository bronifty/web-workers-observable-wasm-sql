export interface IObservable {
    value: any;
    subscribe(handler: (current: any, previous: any) => void, signal?: AbortSignal): () => void;
    publish(): void;
    push(item: any): void;
    compute(): void;
    _dependencyArray: IObservable[];
}
export declare class Observable implements IObservable {
    private _value;
    private _previousValue;
    private _subscribers;
    private _valueFn;
    private _valueFnArgs;
    static _computeActive: IObservable | null;
    _dependencyArray: IObservable[];
    private _lastPromiseId;
    private _isComputing;
    private _promiseQueue;
    private _generationCounter;
    constructor(init: Function | any, ...args: any[]);
    get value(): any;
    set value(newVal: any);
    subscribe: (handler: Function, signal?: AbortSignal) => (() => void);
    publish: () => void;
    computeHandler: () => any;
    compute: () => void;
    private bindComputedObservable;
    push: (item: any) => void;
    static delay(ms: number): any;
}
interface IObservableFactory {
    create?(initialValue: any, ...args: any[]): IObservable;
    useState?: (initialValue: any) => [
        () => any,
        (newValue: any) => void,
        (callback: (newValue: any) => void) => void,
        (handler: (current: any, previous: any) => void, signal?: AbortSignal) => () => void
    ];
}
export default class ObservableFactory implements IObservableFactory {
    static create(initialValue: any, ...args: any[]): IObservable;
    static useState(initialValue: any, ...args: any[]): [
        () => any,
        (newValue: any) => void,
        (callback: (value: any) => void) => () => void
    ];
}
export {};
