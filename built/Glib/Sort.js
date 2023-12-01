"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sorts = void 0;
class Sorts {
    static LeastFirst = (a, b) => a - b;
    static GreatestFirst = (a, b) => b - a;
    static Alphabetical = (a, b) => a.localeCompare(b);
}
exports.Sorts = Sorts;
