import { Cx } from "./Complex"
import { Array2D, XY } from "./XY"

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
    IncrementOrCreate (index: number, value?: number): void
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
    toCx(): Cx[]

    //String
    toIntArray(radix?: number): number[]
}
Array.prototype.Copy = function() {
    let a: any[] = []
    this.forEach((val, i) => {
        a[i] = val
    })
    a.length = this.length
    return a
}
Array.prototype.CopyFast = function() {
    let a: any[] = []
    for (let i = 0; i < this.length; i++)
        a[i] = this[i]
    return a
}
Array.prototype.Push = function<T> (val: T) {
    this[this.length] = val
}
Array.prototype.set = function<T>(index: number, value: T) {
    this[index] = value
}
Array.prototype.ForEach = function <T>(action: (value: T, index: number, array: T[]) => boolean | void): void {
    for (let i = 0; i < this.length; i++) {
        if (action(this.at(i), i, this) === true) break
    }
}
Array.prototype.forEachReversed = function<T>(action: (value: T, index: number, array: T[]) => boolean | void): void {
    for (let i = this.length - 1; i >= 0; i--) {
        if (action(this.at(i), i, this) === true) break
    }
}
Array.prototype.forEachPair = function(action: (value: any[], index: number[]) => void, allowDuplicates = true, allowDoubles = true) {
    const pairs: string[] = []
    this.forEach((val, i) => {
        this.forEach((val2, ii) => {
            if (allowDoubles ||  i != ii) {
                const svals = [val, val2].sort((a, b) => a - b).toString()
                if (allowDuplicates || !pairs.includes(svals)) action([val, val2], [i, ii])
                pairs.push(svals)
            }
        })
    })
}
Array.prototype.Reduce = function<T, TT>(action: (prev: TT, val: T, index: number, arr: any[]) => TT | [TT, boolean], start?: TT): TT {
    let accum: TT = start ?? this.at(0)
    const arr: T[] = (start !== undefined ? this : this.slice(1))
    arr.ForEach((v, i, a) => {
        let ac = action(accum, v, i, a)
        if ((ac as [TT, boolean])[1] !== undefined) {
            let ret = (ac as [TT, boolean])[1]
            accum = (ac as [TT, boolean])[0] as TT

            if (ret === true) {
                return true;
            }
        }
        else {
            accum = ac as TT
        }
    })
    return accum
}
Array.prototype.Random = function() {
    return this[Math.floor((Math.random() * this.length))];
}
Array.prototype.Reverse = function() {
    const a = this.Copy()
    a.reverse()
    return a;
}
Array.prototype.Sort = function (compareFn ?: ((a: any, b: any) => number) | undefined) {
    const a = this.Copy()
    a.sort(compareFn)
    return a;
}
Array.prototype.forEachGroup = function(groupSize: number, action: (value: any[], index: number[]) => void, allowDuplicates = true, allowDoubles = true) {
    const pairs: string[] = []
    forEachRecursive(this, groupSize, (vals, inds) => {
        if (allowDoubles || inds.IsUnique()) {
            const svals = vals.Copy().sort((a, b) => a - b).toString()
            if (allowDuplicates || !pairs.includes(svals)) action(vals, inds)
            pairs.push(svals)
        }
    })
}
Array.prototype.Intersect = function<T>(a: T[]) {
    return this.filter(e => a.includes(e))
}
function forEachRecursive(array: any[], times: number, action: (values: any[], indices: number[]) => void, values: any[] = [], indices: number[] = []) {
    if (times == 0) {
        action(values, indices)
    } else {
        array.forEach((val, i) => {
            let newvals = [...values, val],
                newinds = [...indices, i]
            forEachRecursive(array, times - 1, action, newvals, newinds)
        });
    }
}
Array.prototype.ReduceAccumulate = function(lambda: (prev: any, val: any, index: number, a: any[]) => number) {
    let acc = 0

    this.reduce((prev, val, i, a) => (acc += lambda(prev, val, i, a), val))

    return acc
}
Array.prototype.MostCommon = function() {
    return this.sort((a,b) =>
          this.filter(v => v === a).length
        - this.filter(v => v === b).length
    ).pop()
}
Array.prototype.LeastCommon = function() {
    return this.sort((a,b) =>
          this.filter(v => v === a).length
        - this.filter(v => v === b).length
    ).shift()
}
Array.prototype.Uniques = function () { //isEQ: (a: T, b: T) => boolean = (a, b) => a === b
    return this.filter((value, i) => this.indexOf(value) === i)
}
Array.prototype.Duplicates = function () { //isEQ: (a: T, b: T) => boolean = (a, b) => a === b
    return this.filter((value, i) => this.indexOf(value) !== i)
}
Array.prototype.IsUnique = function() {
    return this.Uniques().length == this.length
}
Array.prototype.toIntArray = function(radix = 10) {
    return this.map(n => parseInt(n, radix))
}
Array.prototype.ReduceFilter = function(filter: (value: any, index: number, array: any[]) => boolean) {
    //loops until the list has one element, which it returns; 
    // in each iteration, it filters the list by the filter
    let arr = this.Copy()
    while (true) {
        arr = arr.filter(filter)
        if (arr.length === 1) return arr[0]
    }
}
Array.prototype.FillEmpty = function(fillValue: any, pad?: number) {
    const arr = [],
        len = pad ?? this.length
    for (let i = 0; i < len; i++) {
        arr[i] = this[i] ?? fillValue
    }
    return arr
}
Array.prototype.Count = function(predicate?: (value: any, index: number, array: any[]) => boolean) {
    return this.filter(predicate ?? (b => b)).length
}
Array.prototype.IncrementOrCreate = function(index: number, value = 1) {
    if (this[index]) this[index] += value
    else this[index] = value
}
// Array.prototype.BinarySearch = function<T>(search: (value: T, index: number) => boolean) {
//     let index = this.length / 2,
//         prevVal
//     for (let i = this.length; true; i++) {
//         if (search(this[index], index))
//             index += index / 2
//         else index /= 2
//         prevVal = index
//     }
// }

Array.prototype.Permutations = function<T>() {
    let result: T[][] = [];

    const permute = (arr: T[], m: T[] = []) => {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(this)

    return result;
}
Array.prototype.Frequency = function<T>(val: T) {
    return (this as T[]).reduce((a, b) => a + (b === val ? 1 : 0), 0)
}

Array.prototype.Frequencies = function<T>(sort = false) {
    const fs = (this as T[]).Uniques().map(u => [u, this.Frequency(u)] as [T, number])
    return sort ? fs.sort((a, b) => b[1]-a[1]) : fs
}
Array.prototype.MaxFrequency = function<T>() {
    return (this as T[]).Uniques().reduce((max, u) => {
        const freq = this.Frequency(u)
        return freq > max? freq : max
    }, 0)
}
Array.prototype.RemoveUndefined = function<T>() {
    const arr: NonNullable<T>[] = []
    for (const v of this as T[]) {
        if (v != undefined && v != null) arr.push(v as NonNullable<T>)
    }
    return arr
}
Array.prototype.UndefinedIfEmpty = function<T>(): T[] | undefined {
    return this.length === 0 ? undefined : this
}
Array.prototype.WithIndices = function<T>() {
    return (this as T[]).map((v, i) => [v, i] as [T, number])
}
Array.prototype.Indices = function() {
    return this.map((_, i) => i)
}
Array.prototype.Median = function() {
    const arr = this.sort((a, b) => a - b),
        len = arr.length / 2
    if (this.length.IsEven()) {
        return (arr[Math.floor(len)] + arr[Math.ceil(len)]) / 2
    }
    else {
        return this.at(arr.length / 2)
    } 
}
Array.prototype.Max = function() {
    return Math.max(...this)
}
Array.prototype.Min = function() {
    return Math.min(...this)
}
Array.prototype.Log = function() {
    console.log(this)
    return this
}

type numericals = number | bigint
interface Array<T> {//<T extends numericals> {
    Sum(): T
    Product(): T
    toInt(radix?: number): number
}
Array.prototype.Sum = function() {
    return this.reduce((p,c) => p+c)
}
Array.prototype.Product = function() {
    return this.reduce((p, c) => p * c)
}
Array.prototype.toInt = function(radix = 10) {
    return this.join('').toInt(radix)
}
Array.prototype.IncrementOrCreate2D = function(val1: number, val2: number) {
    if (this[val1]) {
        if (this[val1][val2]) this[val1][val2]++
        else this[val1][val2] = 1
    }
    else {
        this[val1] = []
        this[val1][val2] = 1
    }
}
Array.prototype.toObject = function() {
    return Object.fromEntries(this)
}
Array.prototype.toCx = function() {
    return this.map(v => new Cx(v))
}

export function Range(start: number, stop: number) {
    const x = [start, stop].sort((a, b) => a - b)
    return Array.from({ length: x[1] - x[0] }, (_, i) => x[0] + i)
}

export function Convolute(l1: number[], l2: number[], truncate = true): number[] {
    //naive; n^^2
    const xy = new XY(l1.length, l2.length)
    const out: number[] = []
    new Array2D<number>(new XY(l1.length, l2.length))
        .map((_, xy) => l1[xy.X] * l2[xy.Y])
        .forEach((v, xy) => out.IncrementOrCreate(xy.TaxicabNorm, v))
    return truncate ? out.slice(xy.Least - 1, out.length - xy.Least + 1) : out
}

export type n1 = [number]
export type n2 = [number, number]
export type n3 = [number, number, number]
export type n4 = [number, number, number, number]
export type n5 = [number, number, number, number, number]
export type n6 = [number, number, number, number, number, number]
export type n7 = [number, number, number, number, number, number, number]
export type n8 = [number, number, number, number, number, number, number, number]
export type n9 = [number, number, number, number, number, number, number, number, number]
