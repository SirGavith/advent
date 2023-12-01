"use strict";
Boolean.prototype.IsTrue = function (action) {
    if (this)
        action();
};
Boolean.prototype.IsFalse = function (action) {
    if (!this)
        action();
};
Boolean.prototype.Log = function () {
    console.log(this);
    return this.valueOf();
};
