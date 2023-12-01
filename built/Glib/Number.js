"use strict";
Number.prototype.plus = function (n) {
    return this.valueOf() + n;
};
Number.prototype.minus = function (n) {
    return this.valueOf() - n;
};
Number.prototype.IsInteger = function () {
    return this.valueOf() % 1 == 0;
};
Number.prototype.IntDigits = function () {
    return [...this.toString()].map(n => parseInt(n));
};
Number.prototype.InRangeEq = function (v1, v2) {
    return this.valueOf() >= v1 && this.valueOf() <= v2;
};
Number.prototype.IsEven = function () {
    return this.valueOf() % 2 === 0;
};
Number.prototype.IsOdd = function () {
    return this.valueOf() % 2 === 1;
};
Number.prototype.SumOfLess = function () {
    return this.valueOf() * (this.valueOf() + 1) * 0.5;
};
Number.prototype.Floor = function () {
    return Math.floor(this.valueOf());
};
Number.prototype.Ceil = function () {
    return Math.ceil(this.valueOf());
};
Number.prototype.RoundFloating = function (epsilon = 0.000001) {
    const r = Math.round(this.valueOf());
    return (Math.abs(r - this.valueOf()) < epsilon) ? r : this.valueOf();
};
Number.prototype.Log = function () {
    console.log(this);
    return this.valueOf();
};
