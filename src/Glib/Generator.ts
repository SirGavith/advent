interface Generator<T, TReturn, TNext> {
    Map<U>(mapper: (value: T) => U): Generator<U>
    // Reduce<TT>(action: (accululator: TT, i: T) => any, startingValue?: TT): Generator

    Reduce(callbackfn: (prevValue: T, value: T, index: number) => T): T;
    Reduce(callbackfn: (prevValue: T, value: T, index: number) => T, initialValue: T): T;
    Reduce<U>(callbackfn: (prevValue: U, value: T, index: number) => U, initialValue: U): U;

}
const GeneratorPrototype = Object.getPrototypeOf(function* () {}).prototype

GeneratorPrototype.Map = function* (mapper: (i: any) => any) {
    for (const val of this) {
        yield mapper(val);
    }
}
GeneratorPrototype.Reduce = function* (action: (accululator: any, i: any) => any, initialValue: any = 0) {
    let accumulator = initialValue
    for (const val of this) {
        accumulator = action(accumulator, val)
        // yield accumulator;
    }
    return accumulator
}