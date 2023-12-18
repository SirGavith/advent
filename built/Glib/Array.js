"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convolute = exports.Range = void 0;
const Complex_1 = require("./Complex");
const XY_1 = require("./XY");
Array.prototype.Copy = function () {
    let a = [];
    this.forEach((val, i) => {
        a[i] = val;
    });
    a.length = this.length;
    return a;
};
Array.prototype.CopyFast = function () {
    let a = [];
    for (let i = 0; i < this.length; i++)
        a[i] = this[i];
    return a;
};
Array.prototype.Push = function (val) {
    this[this.length] = val;
};
Array.prototype.set = function (index, value) {
    this[index] = value;
};
Array.prototype.ForEach = function (action) {
    for (let i = 0; i < this.length; i++) {
        if (action(this.at(i), i, this) === true)
            break;
    }
};
Array.prototype.forEachReversed = function (action) {
    for (let i = this.length - 1; i >= 0; i--) {
        if (action(this.at(i), i, this) === true)
            break;
    }
};
Array.prototype.forEachPair = function (action, allowDuplicates = true, allowDoubles = true) {
    const pairs = [];
    this.forEach((val, i) => {
        this.forEach((val2, ii) => {
            if (allowDoubles || i !== ii) {
                const svals = [val, val2].sort((a, b) => a - b).toString();
                if (allowDuplicates || !pairs.includes(svals))
                    action([val, val2], [i, ii]);
                pairs.push(svals);
            }
        });
    });
};
Array.prototype.Reduce = function (action, start) {
    let accum = start ?? this.at(0);
    const arr = (start !== undefined ? this : this.slice(1));
    arr.ForEach((v, i, a) => {
        let ac = action(accum, v, i, a);
        if (ac[1] !== undefined) {
            let ret = ac[1];
            accum = ac[0];
            if (ret === true) {
                return true;
            }
        }
        else {
            accum = ac;
        }
    });
    return accum;
};
Array.prototype.Random = function () {
    return this[Math.floor((Math.random() * this.length))];
};
Array.prototype.Reverse = function () {
    const a = this.Copy();
    a.reverse();
    return a;
};
Array.prototype.Sort = function (compareFn) {
    const a = this.Copy();
    a.sort(compareFn);
    return a;
};
Array.prototype.forEachGroup = function (groupSize, action, allowDuplicates = true, allowDoubles = true) {
    const pairs = [];
    forEachRecursive(this, groupSize, (vals, inds) => {
        if (allowDoubles || inds.IsUnique()) {
            const svals = vals.Copy().sort((a, b) => a - b).toString();
            if (allowDuplicates || !pairs.includes(svals))
                action(vals, inds);
            pairs.push(svals);
        }
    });
};
Array.prototype.Intersect = function (a) {
    return this.filter(e => a.includes(e));
};
function forEachRecursive(array, times, action, values = [], indices = []) {
    if (times == 0) {
        action(values, indices);
    }
    else {
        array.forEach((val, i) => {
            let newvals = [...values, val], newinds = [...indices, i];
            forEachRecursive(array, times - 1, action, newvals, newinds);
        });
    }
}
Array.prototype.Run = function (l1, l2) {
    return [l1(this[0]), l2(this[1])];
};
Array.prototype.ReduceAccumulate = function (lambda) {
    let acc = 0;
    this.reduce((prev, val, i, a) => (acc += lambda(prev, val, i, a), val));
    return acc;
};
Array.prototype.MostCommon = function () {
    return this.sort((a, b) => this.filter(v => v === a).length
        - this.filter(v => v === b).length).pop();
};
Array.prototype.LeastCommon = function () {
    return this.sort((a, b) => this.filter(v => v === a).length
        - this.filter(v => v === b).length).shift();
};
Array.prototype.Uniques = function () {
    return this.filter((value, i) => this.indexOf(value) === i);
};
Array.prototype.Duplicates = function () {
    return this.filter((value, i) => this.indexOf(value) !== i);
};
Array.prototype.IsUnique = function () {
    return this.Uniques().length == this.length;
};
Array.prototype.toIntArray = function (radix = 10) {
    return this.map(n => parseInt(n, radix));
};
Array.prototype.ReduceFilter = function (filter) {
    //loops until the list has one element, which it returns; 
    // in each iteration, it filters the list by the filter
    let arr = this.Copy();
    while (true) {
        arr = arr.filter(filter);
        if (arr.length === 1)
            return arr[0];
    }
};
Array.prototype.FillEmpty = function (fillValue, pad) {
    const arr = [], len = pad ?? this.length;
    for (let i = 0; i < len; i++) {
        arr[i] = this[i] ?? fillValue;
    }
    return arr;
};
Array.prototype.Count = function (predicate) {
    return this.filter(predicate ?? (b => b)).length;
};
Array.prototype.IncrementOrCreate = function (index, value = 1) {
    if (this[index])
        this[index] += value;
    else
        this[index] = value;
    return this;
};
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
Array.prototype.Permutations = function () {
    let result = [];
    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            result.push(m);
        }
        else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next));
            }
        }
    };
    permute(this);
    return result;
};
Array.prototype.Frequency = function (val) {
    return this.reduce((a, b) => a + (b === val ? 1 : 0), 0);
};
Array.prototype.Frequencies = function (sort = false) {
    const fs = this.Uniques().map(u => [u, this.Frequency(u)]);
    return sort ? fs.sort((a, b) => b[1] - a[1]) : fs;
};
Array.prototype.MaxFrequency = function () {
    return this.Uniques().reduce((max, u) => {
        const freq = this.Frequency(u);
        return freq > max ? freq : max;
    }, 0);
};
Array.prototype.RemoveUndefined = function () {
    const arr = [];
    for (const v of this) {
        if (v != undefined && v != null)
            arr.push(v);
    }
    return arr;
};
Array.prototype.UndefinedIfEmpty = function () {
    return this.length === 0 ? undefined : this;
};
Array.prototype.WithIndices = function () {
    return this.map((v, i) => [v, i]);
};
Array.prototype.Indices = function () {
    return this.map((_, i) => i);
};
Array.prototype.Median = function () {
    const arr = this.sort((a, b) => a - b), len = arr.length / 2;
    if (this.length.IsEven()) {
        return (arr[Math.floor(len)] + arr[Math.ceil(len)]) / 2;
    }
    else {
        return this.at(arr.length / 2);
    }
};
Array.prototype.Max = function () {
    return Math.max(...this);
};
Array.prototype.Min = function () {
    return Math.min(...this);
};
Array.prototype.Log = function () {
    console.log(this);
    return this;
};
Array.prototype.With = function (i, val) {
    const arr = this.CopyFast();
    arr.set(i, val);
    return arr;
};
Array.prototype.Sum = function () {
    return this.reduce((p, c) => p + c);
};
Array.prototype.Product = function () {
    return this.reduce((p, c) => p * c);
};
Array.prototype.toInt = function (radix = 10) {
    return this.join('').toInt(radix);
};
Array.prototype.IncrementOrCreate2D = function (val1, val2) {
    if (this[val1]) {
        if (this[val1][val2])
            this[val1][val2]++;
        else
            this[val1][val2] = 1;
    }
    else {
        this[val1] = [];
        this[val1][val2] = 1;
    }
};
Array.prototype.Transpose2D = function () {
    // this = [[a,b],[c,d]]
    const arr = [];
    for (let i = 0; i < this[0].length; i++)
        arr.push(this.map(e => e[i]));
    return arr;
};
Array.prototype.toObject = function () {
    return Object.fromEntries(this);
};
Array.prototype.toCx = function () {
    return this.map(v => new Complex_1.Cx(v));
};
function Range(start, stop) {
    const x = [start, stop].sort((a, b) => a - b);
    return Array.from({ length: x[1] - x[0] }, (_, i) => x[0] + i);
}
exports.Range = Range;
function Convolute(l1, l2, truncate = true) {
    //naive; n^^2
    const xy = new XY_1.XY(l1.length, l2.length);
    const out = [];
    new XY_1.Array2D(new XY_1.XY(l1.length, l2.length))
        .map((_, xy) => l1[xy.X] * l2[xy.Y])
        .forEach((v, xy) => out.IncrementOrCreate(xy.TaxicabNorm, v));
    return truncate ? out.slice(xy.Least - 1, out.length - xy.Least + 1) : out;
}
exports.Convolute = Convolute;
