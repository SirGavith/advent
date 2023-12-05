"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
//part 1
main_1.Data.map(card => {
    const [win, nums] = card.slice(8).split('|').map(l => l.toIntList(10, ' ').filter(n => !isNaN(n)));
    // console.log(win, nums)
    const c = nums.Count(n => win.includes(n));
    return (c === 0 ? 0 : 2 ** (c - 1));
}).Sum().Log();
//part 2
const counts = main_1.Data.map(() => 1);
for (let i = 0; i < counts.length; i++) {
    const [win, nums] = main_1.Data[i].slice(8).split('|').map(l => l.toIntList(10, ' ').filter(n => !isNaN(n)));
    const count = nums.Count(n => win.includes(n));
    for (let j = i + 1; j < i + 1 + count; j++)
        counts[j] += counts[i];
}
counts.Sum().Log();
//part 2 condensed
main_1.Data.map(() => 1).map((l, i, a) => {
    const [win, nums] = main_1.Data[i].slice(8).split('|').map(l => l.toIntList(10, ' ').filter(n => !isNaN(n)));
    for (let j = 0; j < nums.Count(n => win.includes(n)); j++)
        a[i + j + 1] += l;
    return l;
}).Sum().Log();
