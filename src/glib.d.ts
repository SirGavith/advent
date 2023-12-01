interface Array<T> {
    /** returns a shallow copy of an array */
    Copy(): T[]
    CopyFast(): T[]
    Push(val: T): void
    set(index: number, value: T): void
    ForEach(action: (value: T, index: number, array: T[]) => boolean | void): void
    forEachReversed(action: (value: T, index?: number, array?: T[]) => boolean | void): void
    forEachPair(action: (value: T[], index: number[]) => void, allowDuplicates?: boolean, allowDoubles?: boolean): void
    forEachGroup(groupSize: number, action: (value: T[], index: number[]) => void, allowDuplicates?: boolean, allowDoubles?: boolean): void
    Reduce(action: (prev: T, val: T, index: number, arr: T[]) => T | [T, boolean]): T
    Reduce(action: (prev: T, val: T, index: number, arr: T[]) => T | [T, boolean], start: T): T
    Reduce<TT>(action: (prev: TT, val: T, index: number, arr: T[]) => TT | [TT, boolean], start: TT): TT
    Intersect(arr: T[]): T[]
    Uniques(): T[]
    Duplicates(): T[]
    IsUnique(): boolean
    MostCommon(): T
    LeastCommon(): T
    /** loops until the list has one element, which it returns. 
     in each iteration, it filters the list by the filter */
    ReduceFilter(filter: (value: T, index: number, array: T[]) => boolean): T
    ReduceAccumulate(lambda: (prev: T, val: T, index: number, a: T[]) => number): number
    FillEmpty(value: T, pad?: number): Array<T>
    Count(predicate?: (value: T, index: number, array: T[]) => boolean): number
    IncrementOrCreate(index: number, value?: number): void
    // BinarySearch(search: (value: T, index: number) => boolean): T
    Permutations(): T[][]
    Frequency(val: T): number
    Frequencies(sort?: boolean): [T, number][]
    MaxFrequency(): number
    Random(): T
    Reverse(): T[]
    Sort(compareFn?: ((a: T, b: T) => number) | undefined): T[]
    UndefinedIfEmpty(): T[] | undefined
    RemoveUndefined(): NonNullable<T>[]
    WithIndices(): [T, number][]
    Indices(): number[]
    Median(): T
    Max(): T
    Min(): T
    Log(): Array<T>

    IncrementOrCreate2D(val1: number, val2: number): void
    toObject(): {}

    //Number
    Sum(): T
    Product(): T
    toInt(radix?: number): number
    toCx(): Cxp[]

    //String
    toIntArray(radix?: number): number[]
}
interface Boolean {
    IsTrue(action: () => void): void;
    IsFalse(action: () => void): void;
    Log(): boolean;
}
interface Number {
    IsInteger(): boolean;
    /** @returns An array of the digits of the number */
    IntDigits(): number[];
    InRangeEq(v1: number, v2: number): boolean;
    IsEven(): boolean;
    IsOdd(): boolean;
    SumOfLess(): number;
    Floor(): number;
    Ceil(): number;
    Log(): number;
}
interface Object {
    RemoveUndefinedVals(): {};
    Values(): any[];
    Keys(): string[];
    Entries(): [string, any][];
    filter(filter: (key: string, val: any) => boolean): {};
    forEach(lambda: (key: string, val: any) => void): void;
    Copy(): {};
    IncrementOrCreate(key: string, value?: number | bigint): void;
    Log(): {};
}
interface String {
    toIntList(radix?: number, delim?: string): number[];
    toFloatList(delim?: string): number[];
    toInt(radix?: number): number;
    toFloat(radix?: number): number;
    toNumsArray(): number[]
    toArray(includeNewlines?: boolean): string[];
    in(str: string): boolean;
    SplitLines(): string[];
    Split2Lines(): string[]
    RegexTest(regex: RegExp): boolean;
    ReplaceMap(map: {
        [key: string]: string;
    }): string;
    RemoveChars(chars: string[]): string;
    IsAllCapital(): boolean;
    forEach(lambda: (val: string, index: number) => void): void;
    AsColor(color: string): string
    Log(): string;
}
