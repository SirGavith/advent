interface Array<T> {
    /** returns a shallow copy of an array */
    Copy(): T[]
    CopyFast(): T[]
    Push(val: T): T[]
    set(index: number, value: T): void
    ForEach(action: (value: T, index: number, array: T[]) => boolean | void): void
    forEachReversed(action: (value: T, index?: number, array?: T[]) => boolean | void): void
    forEachPair(action: (value: [T, T], index: [number, number]) => void, allowDuplicates?: boolean, allowDoubles?: boolean, allowCrosspairs?: boolean): void
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
    Accumulate(predicate: (value: T, index: number, array: T[]) => number): number
    IncrementOrCreate(index: number, value?: number): Array<T>
    // BinarySearch(search: (value: T, index: number) => boolean): T
    Permutations(): T[][]
    Frequency(val: T): number
    Frequencies(sort?: boolean): [T, number][]
    FrequencyMap(): Map<T, number>
    MaxFrequency(): number
    Random(): T
    Reverse(): T[]
    Sort(compareFn?: ((a: T, b: T) => number) | undefined): T[]
    UndefinedIfEmpty(): T[] | undefined
    RemoveUndefined(): NonNullable<T>[]
    WithIndices(): [T, number][]
    Indices(): number[]
    Log(): Array<T>
    With(i: number, val: T): Array<T>
    
    IncrementOrCreate2D(val1: number, val2: number): void
    Transpose2D(): Array<T>
    toObject(): {}
    Run<U1, U2>(l1: (value: T) => U1, l2: (value: T) => U2): [U1, U2]
    Run<U1, U2, U3>(l1: (value: T) => U1, l2: (value: T) => U2, l3: (value: T) => U3): [U1, U2, U3]
    Run<U1, U2, U3, U4>(l1: (value: T) => U1, l2: (value: T) => U2, l3: (value: T) => U3, l4: (value: T) => U4): [U1, U2, U3, U4]



    //Number
    Median(): T
    Max(): T
    Min(): T
    Sum(): T
    Product(): T
    toInt(radix?: number): number
    toCx(): Cxp[]

    //String
    toIntArray(radix?: number): number[]
}
interface Array<T extends Array<U>> {
//     toObject(): {[key: ]}
    PushOrCreate2D(index: number, value: U): void
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
    NumDigits(): number
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
    PushOrCreate2D(key: string, value: any): void
    Log(): {};
}
interface String {
    toIntList(delim?: string, radix?: number): number[];
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
