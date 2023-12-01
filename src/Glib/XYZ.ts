type nXYZ = number | XYZ
export class XYZ {
    X: number
    Y: number
    Z: number

    constructor()
    constructor(size: number)
    constructor(X: number, Y: number, Z: number)

    constructor(X?: number, Y?: number, Z?: number) {
        this.X = X ?? 0
        this.Y = Y ?? this.X
        this.Z = Z ?? this.X
    }

    private static parseInput(n: nXYZ, n2?: number, n3?: number): XYZ {
        return typeof n === "number" ? new XYZ(n, n2 ?? n, n3 ?? n2 ?? n) : n
    }

    private set(xyz: XYZ) {
        ({X: this.X, Y: this.Y, Z: this.Z} = xyz)
    }

    plus(n: nXYZ, n2?: number, n3?: number) {
        const xyz = XYZ.parseInput(n, n2, n3)
        return new XYZ(this.X + xyz.X, this.Y + xyz.Y, this.Z + xyz.Z)
    }
    plusEQ(n: nXYZ, n2?: number, n3?: number) { return this.set(this.plus(n, n2, n3)) }
    minus(n: nXYZ, n2?: number, n3?: number) {
        const xy = XYZ.parseInput(n, n2, n3)
        return new XYZ(this.X - xy.X, this.Y - xy.Y, this.Z - xy.Z)
    }
    minusEQ(n: nXYZ, n2?: number, n3?: number) { return this.set(this.minus(n, n2, n3)) }

    compTimes(n: nXYZ, n2?: number, n3?: number) {
        const xy = XYZ.parseInput(n, n2, n3)
        return new XYZ(this.X * xy.X, this.Y * xy.Y, this.Z * xy.Z)
    }
    compTimesEQ(n: nXYZ, n2?: number, n3?: number) { return this.set(this.compTimes(n, n2, n3)) }
    compDiv(n: nXYZ, n2?: number, n3?: number) {
        const xy = XYZ.parseInput(n, n2, n3)
        return new XYZ(this.X / xy.X, this.Y / xy.Y, this.Z / xy.Z)
    }
    compDivEQ(n: nXYZ, n2?: number, n3?: number) { return this.set(this.compDiv(n, n2, n3)) }


    EQ(xyz: XYZ) { return xyz.X === this.X && xyz.Y === this.Y && this.Z === xyz.Z }

    IsLessEQAll(xy: XYZ) { return this.X <= xy.X && this.Y <= xy.Y && this.Z <= xy.Z }
    IsLessAll(xy: XYZ) { return this.X < xy.X && this.Y < xy.Y && this.Z < xy.Z }
    IsGreaterEQAll(xy: XYZ) { return this.X >= xy.X && this.Y >= xy.Y && this.Z >= xy.Z }
    IsGreaterAll(xy: XYZ) { return this.X > xy.X && this.Y > xy.Y && this.Z > xy.Z }


    ManhattanDist(xyz: XYZ) {
        const m = this.minus(xyz).Abs()
        return m.X + m.Y + m.Z
    }

    Abs() { return new XYZ(Math.abs(this.X), Math.abs(this.Y), Math.abs(this.Z)) }

    toArray() { return [this.X, this.Y, this.Z] }
    toString() { return `(${this.X}, ${this.Y}, ${this.Z})` }
    Copy() { return new XYZ(this.X, this.Y, this.Z) }

    foreachCombination(lambda: (xy: XYZ) => void, startXYZ = new XYZ) {
        for (let z = startXYZ.Z; z <= this.Z; z++)
            for (let y = startXYZ.Y; y <= this.Y; y++)
                for (let x = startXYZ.X; x <= this.X; x++)
                    lambda(new XYZ(x, y, z))
    }

    Combinations(startXYZ = new XYZ) {
        const combos: XYZ[] = []
        this.foreachCombination(xyz => combos.push(xyz), startXYZ)
        return combos
    }

    // Does not include this
    Neighbours(includeDiags = false) {
        if (includeDiags) throw new Error('Not implemented')
        return includeDiags ? [

        ] : [
            this.plus(-1, 0, 0),
            this.plus(1, 0, 0),
            this.plus(0, 1, 0),
            this.plus(0, -1, 0),
            this.plus(0, 0, 1),
            this.plus(0, 0, -1),
        ]
    }
    // Includes this
    Neighbourhood(includeDiags = false) {
        if (includeDiags) throw new Error('Not implemented')
        return includeDiags ? [

        ] : [
            this.plus(-1, 0, 0),
            this.plus(1, 0, 0),
            this.plus(0, 1, 0),
            this.Copy(),
            this.plus(0, -1, 0),
            this.plus(0, 0, 1),
            this.plus(0, 0, -1),
        ]
    }

    Orientations () {
        let [x, y, z] = this.toArray()
        return [
            new XYZ(x, y, z),
            new XYZ(x, z, -y),
            new XYZ(x, -y, -z),
            new XYZ(x, -z, y),

            new XYZ(-x, -y, z),
            new XYZ(-x, z, y),
            new XYZ(-x, y, -z),
            new XYZ(-x, -z, -y),

            new XYZ(y,-x, z),
            new XYZ(y,-z, -x),
            new XYZ(y, x, -z),
            new XYZ(y, z, x),

            new XYZ(-y, z, -x),
            new XYZ(-y, x, z),
            new XYZ(-y, -z, x),
            new XYZ(-y, -x, -z),

            new XYZ(z, -y, x),
            new XYZ(z, -x, -y),
            new XYZ(z, y, -x),
            new XYZ(z, x, y),

            new XYZ(-z, y, x),
            new XYZ(-z, -x, y),
            new XYZ(-z, -y, -x),
            new XYZ(-z, x, -y),
        ]
    }


    static toString(a: XYZ[]): string {
        return a.map(xy => `(${xy.toString()})`).join(', ')
    }

    static fromString(s: string) {
        s = s.RemoveChars('()[]{} '.toArray())
        return new XYZ(...s.split(', ').toIntArray() as [number, number, number])
    }
    static fromTuple(t: [number, number, number]) {
        return new XYZ(t[0], t[1], t[2])
    }
}


export class Array3D<T> {
    Array: (T | undefined)[][][] = []

    constructor(public Size: XYZ, fillValue: T|undefined = undefined) {
        for (let i = 0; i < Size.Z; i++) {
            this.Array[i] = []
            for (let ii = 0; ii < Size.Y; ii++) {
                this.Array[i][ii] = Array(Size.X).fill(fillValue)
            }
        }
    }

    get(xy: XYZ) {
        return this.Array.at(xy.Z)?.at(xy.Y)?.at(xy.X)
    }

    set(xy: XYZ, value: T | undefined) {
        this.Array.at(xy.Z)?.at(xy.Y)?.set(xy.X, value)
    }

    Copy() {
        const arr = new Array3D<T>(this.Size)
        arr.Array = this.Array.map(a => a.map(b => b.Copy()))
        return arr
    }

    forEach(lambda: (value: T | undefined, index: XYZ) => void) {
        for (let z = 0; z < this.Array.length; z++) {
            for (let y = 0; y < this.Array[z].length; y++) {
                for (let x = 0; x < this.Array[z][y].length; x++) {
                    let xyz = new XYZ(x, y, z)
                    lambda(this.get(xyz), xyz)
                }
            }
        }
    }

    map<TT>(lambda: (value: T | undefined, index: XYZ) => TT | undefined) {
        const arr = new Array3D<TT>(this.Size)
        this.forEach((val, xyz) => arr.set(xyz, lambda(val, xyz)))
        return arr
    }
    
    Flatten() {
        return this.Array.flat(2).filter(t => t)
    }

    Log() {
        console.log('[')
        this.Array.forEach(a => {
            //log subarray
            console.log(' [')
            a.forEach(b => {
                console.log(' |', b)
            })
            console.log(' ]')
        })
        console.log(']')
        return this
    }

    Entries() {
        const arr: [XYZ, T][] = []
        this.forEach((val, xyz) => {
            if (val) arr.push([xyz, val])
        })
        return arr
    }
}