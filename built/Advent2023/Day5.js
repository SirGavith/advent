"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
//part 1
const steps1 = main_1.DataFull.Split2Lines().slice(1);
main_1.Data[0].slice(7).toIntList(' ')
    .map((seed) => {
    steps1.forEach(s => {
        const step = s.SplitLines().slice(1).map(r => r.toIntList(' '));
        step.ForEach(r => {
            if (seed >= r[1] && seed < r[1] + r[2]) {
                seed += r[0] - r[1];
                return true;
            }
        });
    });
    return seed;
}).Min();
//part 2
// [INCLUSIVE, EXCLUSIVE]
const mappings = main_1.DataFull.Split2Lines().slice(1).map(s => s.SplitLines().slice(1).map(r => r.toIntList(' '))
    .map(r => [r[1], r[1] + r[2], r[0] - r[1]] //rangeLo, rangeHi, offset
).sort((a, b) => a[0] - b[0]));
let ranges = [];
const a = main_1.Data[0].slice(7).toIntList(' ');
for (let i = 0; i < a.length; i += 2)
    ranges.push([a[i], a[i] + a[i + 1]]);
for (const mapping of mappings) {
    const outRanges = [];
    while (ranges.length >= 1) {
        const range = ranges.pop();
        mapping.some(([mLo, mHi, offset]) => {
            if (range[0] >= mLo && range[1] <= mHi) {
                //within mapping
                outRanges.push([range[0] + offset, range[1] + offset]);
                return true;
            }
            else if (range[0] >= mLo && range[0] < mHi) {
                //range begins in mapping
                outRanges.push([range[0] + offset, mHi + offset]);
                ranges.push([mHi, range[1]]);
                return true;
            }
            else if (range[1] > mLo && range[1] <= mHi) {
                //range ends in mapping
                outRanges.push([mLo + offset, range[1] + offset]);
                ranges.push([range[0], mLo]);
                return true;
            }
            else if (range[0] < mLo && range[1] > mHi) { // never called
                //mapping is within range
                outRanges.push([mLo + offset, mHi + offset]);
                ranges.push([range[0], mLo]);
                ranges.push([mHi, range[1]]);
                return true;
            }
        }).IsFalse(() => outRanges.push(range));
    }
    ranges = outRanges;
}
ranges.map(r => r[0]).Min().Log();
