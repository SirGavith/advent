interface Number {
    plus(n: number): number
    minus(n: number): number

    IsInteger(): boolean
    /** @returns An array of the digits of the number */
    IntDigits(): number[]
    NumDigits(): number
    InRangeEq(v1: number, v2: number): boolean
    IsEven(): boolean
    IsOdd(): boolean
    SumOfLess(): number
    Floor(): number
    Ceil(): number
    RoundFloating(epsilon?: number): number
    Log(): number
}
type num = number
type numericals = number | bigint
Number.prototype.plus = function (n: number) {
    return this.valueOf() + n
}
Number.prototype.minus = function (n: number) {
    return this.valueOf() - n
}


Number.prototype.IsInteger = function() {
    return this.valueOf() % 1 == 0
}
Number.prototype.IntDigits = function() {
    return [...this.toString()].map(n => parseInt(n))
}
Number.prototype.NumDigits = function () {
    const n = this.valueOf()
    return n < 100000 ? n < 100 ? n < 10 ? 1 : 2 : n < 1000 ? 3 : n < 10000 ? 4 : 5 : n < 10000000 ? n < 1000000 ? 6 : 7 : n < 100000000 ? 8 : n < 1000000000 ? 9 : n > 10000000000 ? n.toString().length : 10
}
Number.prototype.InRangeEq = function(v1, v2) {
    return this.valueOf() >= v1 && this.valueOf() <= v2   
}
Number.prototype.IsEven = function() {
    return this.valueOf() % 2 === 0
}
Number.prototype.IsOdd = function() {
    return this.valueOf() % 2 === 1
}
Number.prototype.SumOfLess = function() {
    return this.valueOf() * (this.valueOf() + 1) * 0.5
}
Number.prototype.Floor = function() {
    return Math.floor(this.valueOf())
}
Number.prototype.Ceil = function() {
    return Math.ceil(this.valueOf())
}
Number.prototype.RoundFloating = function(epsilon = 0.000001) {
    const r = Math.round(this.valueOf())
    return (Math.abs(r - this.valueOf()) < epsilon) ? r : this.valueOf()
}
Number.prototype.Log = function() {
    console.log(this)
    return this.valueOf()
}