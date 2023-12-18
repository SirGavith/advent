"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Array2D = exports.XY = void 0;
const Complex_1 = require("./Complex");
class XY {
    X;
    Y;
    constructor(X, Y) {
        this.X = X ?? 0;
        this.Y = Y ?? this.X;
    }
    static parseInput(n, n2) {
        return typeof n === "number" ? new XY(n, n2 ?? n) : n;
    }
    set(xy) {
        ({ X: this.X, Y: this.Y } = xy);
    }
    plus(n, n2) {
        const xy = XY.parseInput(n, n2);
        return new XY(this.X + xy.X, this.Y + xy.Y);
    }
    plusEQ(n, n2) { this.set(this.plus(n, n2)); }
    minus(n, n2) {
        const xy = XY.parseInput(n, n2);
        return new XY(this.X - xy.X, this.Y - xy.Y);
    }
    minusEQ(n, n2) { this.set(this.minus(n, n2)); }
    times(n, n2) {
        const xy = XY.parseInput(n, n2);
        return new XY(this.X * xy.X, this.Y * xy.Y);
    }
    timesEQ(n, n2) { this.set(this.times(n, n2)); }
    div(n, n2) {
        const xy = XY.parseInput(n, n2);
        return new XY(this.X / xy.X, this.Y / xy.Y);
    }
    divEQ(n, n2) { this.set(this.div(n, n2)); }
    mod(n, n2) {
        const xy = XY.parseInput(n, n2);
        return new XY(this.X % xy.X, this.Y % xy.Y);
    }
    modEQ(n, n2) { this.set(this.mod(n, n2)); }
    EQ(xy) { return xy.X === this.X && xy.Y === this.Y; }
    IsLessEQEither(xy) { return this.X <= xy.X || this.Y <= xy.Y; }
    IsLessEQBoth(xy) { return this.X <= xy.X && this.Y <= xy.Y; }
    IsLessEither(xy) { return this.X < xy.X || this.Y < xy.Y; }
    IsLessBoth(xy) { return this.X < xy.X && this.Y < xy.Y; }
    IsGreaterEQEither(xy) { return this.X >= xy.X || this.Y >= xy.Y; }
    IsGreaterEQBoth(xy) { return this.X >= xy.X && this.Y >= xy.Y; }
    IsGreaterEither(xy) { return this.X > xy.X || this.Y > xy.Y; }
    IsGreaterBoth(xy) { return this.X > xy.X && this.Y > xy.Y; }
    WithinBounds(xy, xy2) { return this.IsGreaterEQBoth(xy) && this.IsLessEQBoth(xy2); }
    WithinArea(xy, size) { return this.IsGreaterEQBoth(xy) && this.minus(xy).IsLessEQBoth(size); }
    Round() { return new XY(Math.round(this.X), Math.round(this.Y)); }
    Floor() { return new XY(Math.floor(this.X), Math.floor(this.Y)); }
    Ceil() { return new XY(Math.ceil(this.X), Math.ceil(this.Y)); }
    Trunc() { return new XY(Math.trunc(this.X), Math.trunc(this.Y)); }
    Abs() { return new XY(Math.abs(this.X), Math.abs(this.Y)); }
    Reverse() { return new XY(this.Y, this.X); }
    Negate() { return new XY().minus(this); }
    DeZero() { return new XY(this.X === 0 ? 1 : this.X, this.Y === 0 ? 1 : this.Y); }
    get Least() { return this.X > this.Y ? this.Y : this.X; }
    get Greatest() { return this.X < this.Y ? this.Y : this.X; }
    get LeastAbs() { return Math.abs(this.X) > Math.abs(this.Y) ? this.Y : this.X; }
    get GreatestAbs() { return Math.abs(this.X) < Math.abs(this.Y) ? this.Y : this.X; }
    get Norm() { return Math.sqrt(this.X ** 2 + this.Y ** 2); }
    get TaxicabNorm() { return Math.abs(this.X) + Math.abs(this.Y); }
    get Area() { return this.X * this.Y; }
    toArray() { return [this.X, this.Y]; }
    toString() { return `${this.X},${this.Y}`; }
    toCx() { return new Complex_1.Cx(this.X, this.Y); }
    Copy() { return new XY(this.X, this.Y); }
    foreachCombination(lambda, startXY = new XY) {
        for (let x = startXY.X; x <= this.X; x++)
            for (let y = startXY.Y; y <= this.Y; y++)
                lambda(new XY(x, y));
    }
    CountCombinations(lambda, startXY) {
        let count = 0;
        this.foreachCombination(xy => {
            if (lambda(xy))
                count++;
        }, startXY ?? new XY);
        return count;
    }
    Combinations(startXY) {
        const combos = [];
        this.foreachCombination(xy => combos.push(xy), startXY);
        return combos;
    }
    //does combinations either way
    static Combinations(a, b) {
        const aa = a.Combinations(b);
        const bb = b.Combinations(a);
        if (aa.length === 0)
            return bb;
        if (bb.length === 0)
            return aa;
        throw new Error('both got combos?');
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
        ];
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
        ];
    }
    static toString(a) {
        return a.map(xy => `(${xy.toString()})`).join(', ');
    }
    static fromString(s) {
        return new XY(...s.toIntList(10, ','));
    }
    static fromTuple(t) {
        return new XY(t[0], t[1]);
    }
    static Zero = new XY;
    static One = new XY(1);
    static Up = new XY(0, 1);
    static Down = new XY(0, -1);
    static Right = new XY(1, 0);
    static Left = new XY(-1, 0);
    static UpLeft = new XY(-1, 1);
    static UpRight = new XY(1, 1);
    static DownLeft = new XY(-1, -1);
    static DownRight = new XY(-1, -1);
    Log() {
        console.log('XY:', this.X, this.Y);
        return this;
    }
}
exports.XY = XY;
class Array2D {
    Size;
    Checked;
    Array = [];
    constructor(Size, fillValue = undefined, Checked = false) {
        this.Size = Size;
        this.Checked = Checked;
        for (let i = 0; i < Size.Y; i++)
            this.Array.push(Array(Size.X).fill(fillValue));
    }
    get(xy) {
        return this.Array[xy.Y] ?
            this.Array[xy.Y][xy.X] :
            undefined;
    }
    getRow(y) {
        return this.Array[y];
    }
    cols = [];
    getCol(x) {
        // return this.Array.map(row => row[x])
        if (this.cols[x] === undefined)
            this.cols[x] = this.Array.map(row => row[x]);
        return this.cols[x];
    }
    set(xy, value) {
        if (this.Checked && !xy.WithinArea(XY.Zero, this.Size.minus(1)))
            throw new Error('Array set out of bounds');
        this.Array[xy.Y][xy.X] = value;
        this.cols = [];
    }
    Copy() {
        const arr = new Array2D(this.Size);
        arr.Array = this.Array.map(a => a.Copy());
        return arr;
    }
    Neighbours(xy, includeDiags = false) {
        return xy.Neighbours(includeDiags).map(n => [n, this.get(n)]).filter(n => n[1] != undefined);
    }
    forEach(lambda) {
        for (let y = 0; y < this.Array.length; y++) {
            for (let x = 0; x < this.Array[y]?.length; x++) {
                let xy = new XY(x, y);
                lambda(this.get(xy), xy, this);
            }
        }
    }
    reduce(lambda, reducer) {
        for (let y = 0; y < this.Array.length; y++) {
            for (let x = 0; x < this.Array[y]?.length; x++) {
                let xy = new XY(x, y);
                reducer = lambda(reducer, this.get(xy), xy, this);
            }
        }
        return reducer;
    }
    every(lambda) {
        for (let y = 0; y < this.Array.length; y++) {
            for (let x = 0; x < this.Array[y]?.length; x++) {
                let xy = new XY(x, y);
                if (!lambda(this.get(xy), xy, this)) {
                    return false;
                }
            }
        }
        return true;
    }
    some(lambda) {
        for (let y = 0; y < this.Array.length; y++) {
            for (let x = 0; x < this.Array[y]?.length; x++) {
                let xy = new XY(x, y);
                if (lambda(this.get(xy), xy, this)) {
                    return true;
                }
            }
        }
        return false;
    }
    map(lambda) {
        const arr = new Array2D(this.Size);
        this.forEach((val, xy) => arr.set(xy, lambda(val, xy, this)));
        return arr;
    }
    Find(element) {
        for (let y = 0; y < this.Array.length; y++) {
            for (let x = 0; x < this.Array[y]?.length; x++) {
                let xy = new XY(x, y);
                if (this.get(xy) === element) {
                    return xy;
                }
            }
        }
        return undefined;
    }
    Flatten() {
        let l = [];
        this.forEach(tile => {
            if (tile) {
                l.push(tile);
            }
        });
        return l;
    }
    Log() {
        // console.log(this)
        console.log('[');
        this.Array.forEach((row, i) => {
            console.log('| ' +
                // i?.toString().padStart(5) + ' ' +
                row.map(v => (v === undefined ? '.' :
                    v === true ? '#' :
                        v === false ? '.' :
                            typeof v === "number" && v === Infinity ? '∞' : String(v)).padStart(1)).join(''));
            // console.log('| '+row.map(v => v ?? '.').join(''))
        });
        console.log(']');
        return this;
    }
    Entries() {
        const arr = [];
        this.forEach((val, xy) => {
            if (val)
                arr.push([xy, val]);
        });
        return arr;
    }
    Superimpose(arr, offset = new XY) {
        if (offset.plus(arr.Size).IsGreaterEither(this.Size) || offset.IsLessEither(new XY))
            throw new Error('out of bounds');
        const a = this.Copy();
        arr.forEach((val, xy) => {
            a.set(xy.plus(offset), val);
        });
        return a;
    }
    SuperimposeSet(arr, offset = new XY) {
        if (offset.plus(arr.Size).IsGreaterEither(this.Size) || offset.IsLessEither(new XY))
            throw new Error('out of bounds');
        // const a = this.Copy()
        arr.forEach((val, xy) => {
            if (val)
                this.set(xy.plus(offset), val);
        });
    }
    SuperimposeEQ(arr, offset = new XY) {
        if (offset.plus(arr.Size).IsGreaterEither(this.Size) || offset.IsLessEither(new XY))
            throw new Error('out of bounds');
        const a = new Array2D(this.Size, false);
        arr.forEach((val, xy) => {
            a.set(xy.plus(offset), val !== undefined && val === this.get(xy.plus(offset)));
        });
        return a;
    }
    SuperimposeOverlap(arr, offset) {
        return arr.some((val, xy) => val === true && val === this.get(xy.plus(offset)));
    }
    Transpose() {
        const arr = new Array2D(new XY(this.Size.Y, this.Size.X));
        this.forEach((v, xy) => {
            arr.set(new XY(xy.Y, xy.X), v);
        });
        return arr;
    }
    static fromArray(arr, size) {
        if (size === undefined && arr.some(row => row.length !== arr[0].length))
            throw new RangeError('Array must be rectangular');
        const out = new Array2D(size ?? new XY(arr[0].length, arr.length));
        arr.forEach((row, y) => {
            row.forEach((tile, x) => {
                out.set(new XY(x, y), tile);
            });
        });
        return out;
    }
    static fromString(a, size) {
        const arr = a.SplitLines();
        if (size === undefined && arr.some(row => row.length !== arr[0].length))
            throw new RangeError('Array must be rectangular');
        const out = new Array2D(size ?? new XY(arr[0].length, arr.length));
        arr.forEach((row, y) => {
            row.forEach((tile, x) => {
                out.set(new XY(x, y), tile);
            });
        });
        return out;
    }
}
exports.Array2D = Array2D;
