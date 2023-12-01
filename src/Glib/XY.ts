import { Cx } from "./Complex"

type nXY = number | XY

export class XY {
    X: number
    Y: number

    constructor()
    constructor(size: number)
    constructor(X: number, Y: number)
    constructor(X?: number, Y?: number) {
        this.X = X ?? 0
        this.Y = Y ?? this.X
    }

    private static parseInput(n: nXY, n2?: number): XY {
        return typeof n === "number" ? new XY(n, n2 ?? n) : n
    }

    private set(xy: XY) {
        ({ X: this.X, Y: this.Y } = xy)
    }

    plus(n: nXY, n2?: number) {
        const xy = XY.parseInput(n, n2)
        return new XY(this.X + xy.X, this.Y + xy.Y)
    }
    plusEQ(n: nXY, n2?: number) { this.set(this.plus(n, n2)) }

    minus(n: nXY, n2?: number) {
        const xy = XY.parseInput(n, n2)
        return new XY(this.X - xy.X, this.Y - xy.Y)
    }
    minusEQ(n: nXY, n2?: number) { this.set(this.minus(n, n2)) }
    times(n: nXY, n2?: number) {
        const xy = XY.parseInput(n, n2)
        return new XY(this.X * xy.X, this.Y * xy.Y)
    }
    timesEQ(n: nXY, n2?: number) { this.set(this.times(n, n2)) }
    div(n: nXY, n2?: number) {
        const xy = XY.parseInput(n, n2)
        return new XY(this.X / xy.X, this.Y / xy.Y)
    }
    divEQ(n: nXY, n2?: number) { this.set(this.div(n, n2)) }
    mod(n: nXY, n2?: number) {
        const xy = XY.parseInput(n, n2)
        return new XY(this.X % xy.X, this.Y % xy.Y)
    }
    modEQ(n: nXY, n2?: number) { this.set(this.mod(n, n2)) }


    EQ(xy: XY) { return xy.X === this.X && xy.Y === this.Y }

    IsLessEQEither(xy: XY) { return this.X <= xy.X || this.Y <= xy.Y }
    IsLessEQBoth(xy: XY) { return this.X <= xy.X && this.Y <= xy.Y }
    IsLessEither(xy: XY) { return this.X < xy.X || this.Y < xy.Y }
    IsLessBoth(xy: XY) { return this.X < xy.X && this.Y < xy.Y }
    IsGreaterEQEither(xy: XY) { return this.X >= xy.X || this.Y >= xy.Y }
    IsGreaterEQBoth(xy: XY) { return this.X >= xy.X && this.Y >= xy.Y }
    IsGreaterEither(xy: XY) { return this.X > xy.X || this.Y > xy.Y }
    IsGreaterBoth(xy: XY) { return this.X > xy.X && this.Y > xy.Y }

    WithinBounds(xy: XY, xy2: XY) { return this.IsGreaterEQBoth(xy) && this.IsLessEQBoth(xy2) }
    WithinArea(xy: XY, size: XY) { return this.IsGreaterEQBoth(xy) && this.minus(xy).IsLessEQBoth(size) }

    Round() { return new XY(Math.round(this.X), Math.round(this.Y)) }
    Floor() { return new XY(Math.floor(this.X), Math.floor(this.Y)) }
    Ceil() { return new XY(Math.ceil(this.X), Math.ceil(this.Y)) }
    Trunc() { return new XY(Math.trunc(this.X), Math.trunc(this.Y)) }
    Abs() { return new XY(Math.abs(this.X), Math.abs(this.Y)) }
    Reverse() { return new XY(this.Y, this.X) }
    Negate() { return new XY().minus(this) }
    DeZero() { return new XY(this.X === 0 ? 1 : this.X, this.Y === 0 ? 1 : this.Y) }

    get Least() { return this.X > this.Y ? this.Y : this.X }
    get Greatest() { return this.X < this.Y ? this.Y : this.X }
    get LeastAbs() { return Math.abs(this.X) > Math.abs(this.Y) ? this.Y : this.X }
    get GreatestAbs() { return Math.abs(this.X) < Math.abs(this.Y) ? this.Y : this.X }
    get Norm() { return Math.sqrt(this.X ** 2 + this.Y ** 2) }
    get TaxicabNorm() { return Math.abs(this.X) + Math.abs(this.Y) }
    get Area() { return this.X * this.Y}

    toArray() { return [this.X, this.Y] }
    toString() { return `${this.X},${this.Y}` }
    toCx() { return new Cx(this.X, this.Y) }
    Copy() { return new XY(this.X, this.Y) }

    foreachCombination(lambda: (xy: XY) => void, startXY = new XY) {
        for (let x = startXY.X; x <= this.X; x++)
            for (let y = startXY.Y; y <= this.Y; y++)
                lambda(new XY(x, y))
    }

    CountCombinations(lambda: (xy: XY) => boolean, startXY?: XY) {
        let count = 0
        this.foreachCombination(xy => {
            if (lambda(xy)) count++
        }, startXY ?? new XY)
        return count
    }

    Combinations(startXY?: XY) {
        const combos: XY[] = []
        this.foreachCombination(xy => combos.push(xy), startXY)
        return combos
    }
    //does combinations either way
    static Combinations(a: XY, b: XY): XY[] {
        const aa = a.Combinations(b)
        const bb = b.Combinations(a)
        if (aa.length === 0) return bb
        if (bb.length === 0) return aa
        throw new Error('both got combos?')
    }

    // Does not include this
    Neighbours(includeDiags = false) {
        return includeDiags ? [
            this.plus(-1, -1),
            this.plus(-1, 0),
            this.plus(-1, 1),
            this.plus(0, -1),
            this.plus(0, 1),
            this.plus(1, -1),
            this.plus(1, 0),
            this.plus(1, 1),
        ] : [
            this.minus(1, 0),
            this.plus(1, 0),
            this.plus(0, 1),
            this.minus(0, 1)
        ]
    }
    // Includes this
    Neighbourhood(includeDiags = false) {
        return includeDiags ? [
            this.plus(-1, -1),
            this.plus(0, -1),
            this.plus(1, -1),
            this.plus(-1, 0),
            this.Copy(),
            this.plus(1, 0),
            this.plus(-1, 1),
            this.plus(0, 1),
            this.plus(1, 1),
        ] : [
            this.minus(1, 0),
            this.plus(1, 0),
            this.Copy(),
            this.plus(0, 1),
            this.minus(0, 1)
        ]
    }

    static toString(a: XY[]): string {
        return a.map(xy => `(${xy.toString()})`).join(', ')
    }

    static fromString(s: string) {
        return new XY(...s.toIntList(10, ',') as [number, number])
    }

    static fromTuple(t: [number, number]) {
        return new XY(t[0], t[1])
    }

    static Zero = new XY
    static One = new XY(1)

    static Up =     new XY(0,  1)
    static Down =   new XY(0, -1)
    static Right =  new XY( 1, 0)
    static Left =   new XY(-1, 0)

    Log() {
        console.log('XY:', this.X, this.Y)
        return this
    }
}

export class Array2D<T> {
    Array: (T | undefined)[][] = []

    constructor(public Size: XY, fillValue: T | undefined = undefined, public Checked = false) {
        for (let i = 0; i < Size.Y; i++)
            this.Array.push(Array(Size.X).fill(fillValue))
    }

    get(xy: XY) {
        return this.Array[xy.Y] ?
            this.Array[xy.Y][xy.X] :
            undefined
    }

    getRow(y: number): Array<T|undefined> {
        return this.Array[y]
    }

    private cols: Array<T | undefined>[] = []
    getCol(x: number): Array<T | undefined> {
        return this.Array.map(row => row[x])

        // if (this.cols[x] === undefined) 
        //     this.cols[x] = this.Array.map(row => row[x])
        // return this.cols[x]
    }

    set(xy:XY, value: T | undefined) {
        if (this.Checked && !xy.WithinArea(XY.Zero, this.Size.minus(1))) throw new Error('Array set out of bounds')
        this.Array[xy.Y][xy.X] = value
        this.cols = []
    }

    Copy() {
        const arr = new Array2D<T>(this.Size)
        arr.Array = this.Array.map(a => a.Copy())
        return arr
    }

    Neighbours(xy: XY, includeDiags = false) {
        return xy.Neighbours(includeDiags).map(n => [n, this.get(n)] as [XY, T | undefined]).filter(n => n[1] != undefined) as [XY, T][]
    }

    forEach(lambda: (value: T | undefined, index: XY, array: this) => void) {
        for (let y = 0; y < this.Array.length; y++) {
            for (let x = 0; x < this.Array[y]?.length; x++) {
                let xy = new XY(x, y)
                lambda(this.get(xy), xy, this)
            }
        }
    }

    every(lambda: (value: T | undefined, index: XY, array: this) => boolean): boolean {
        for (let y = 0; y < this.Array.length; y++) {
            for (let x = 0; x < this.Array[y]?.length; x++) {
                let xy = new XY(x, y)
                if (!lambda(this.get(xy), xy, this)) {
                    return false
                }
            }
        }
        return true
    }
    
    some(lambda: (value: T | undefined, index: XY, array: this) => boolean): boolean {
        for (let y = 0; y < this.Array.length; y++) {
            for (let x = 0; x < this.Array[y]?.length; x++) {
                let xy = new XY(x, y)
                if (lambda(this.get(xy), xy, this)) {
                    return true
                }
            }
        }
        return false
    }

    map<TT>(lambda: (value: T | undefined, index: XY, array: this) => TT | undefined) {
        const arr = new Array2D<TT>(this.Size)
        this.forEach((val, xy) => arr.set(xy, lambda(val, xy, this)))
        return arr
    }
    
    Flatten() {
        let l: T[] = []
        this.forEach(tile => {
            if (tile) {
                l.push(tile)
            }
        })
        return l
    }

    Log() {
        // console.log(this)

        console.log('[')
        this.Array.forEach((row, i) => {
            console.log('| ' + 
                // i?.toString().padStart(5) + ' ' +
                row.map(v => (
                    v === undefined ? ' ' :
                    v as unknown as boolean === true ? '#' :
                    v as unknown as boolean === false ? '.' :
                    typeof v === "number" && v === Infinity ? '∞' : String(v)
                    
                    ).padStart(1)
                ).join('')
            )
            // console.log('| '+row.map(v => v ?? '.').join(''))
        })
        console.log(']')



        return this
    }

    Entries() {
        const arr: [XY, T][] = []
        this.forEach((val, xy) => {
            if (val) arr.push([xy, val])
        })
        return arr
    }

    Superimpose(arr: Array2D<T>, offset: XY = new XY) {
        if (offset.plus(arr.Size).IsGreaterEither(this.Size) || offset.IsLessEither(new XY)) throw new Error('out of bounds')

        const a = this.Copy()

        arr.forEach((val, xy) => {
            a.set(xy.plus(offset), val)
        })

        return a
    }

    SuperimposeSet(arr: Array2D<T>, offset: XY = new XY) {
        if (offset.plus(arr.Size).IsGreaterEither(this.Size) || offset.IsLessEither(new XY)) throw new Error('out of bounds')

        // const a = this.Copy()

        arr.forEach((val, xy) => {
            if (val) this.set(xy.plus(offset), val)
        })
    }

    SuperimposeEQ(arr: Array2D<T>, offset: XY = new XY) {
        if (offset.plus(arr.Size).IsGreaterEither(this.Size) || offset.IsLessEither(new XY)) throw new Error('out of bounds')

        const a = new Array2D<boolean>(this.Size, false)

        arr.forEach((val, xy) => {
            a.set(xy.plus(offset), val !== undefined && val === this.get(xy.plus(offset)))
        })

        return a
    }

    SuperimposeOverlap(arr: Array2D<T>, offset: XY) {
        return arr.some((val, xy) =>
            val as unknown as boolean === true && val === this.get(xy.plus(offset))
        )
    }

    Rotate(): Array2D<T | undefined> {
        const arr = new Array2D<T>(this.Size)
        this.forEach((v, xy) => {
            arr.set(new XY(xy.Y, xy.X), v)
        })
        return arr
    }

    static fromArray<T>(arr: T[][], size?: XY) {
        if (size === undefined && arr.some(row => row.length !== arr[0].length))
            throw new RangeError('Array must be rectangular')

        const out = new Array2D<T>(size ?? new XY(arr[0].length, arr.length))
        arr.forEach((row, y) => {
            row.forEach((tile, x) => {
                out.set(new XY(x, y), tile)
            })
        })
        return out
    }
}