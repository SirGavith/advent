"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
main_1.Data.map(hist => {
    const o = hist.toIntList(10, ' ');
    const t = [o];
    while (!t.at(-1)?.every(n => n === 0)) {
        const s = t.at(-1);
        const arr = [];
        for (let i = 1; i < s.length; i++)
            arr.push(s[i] - s[i - 1]);
        t.push(arr);
    }
    t.Log();
    t.at(-1).push(0);
    for (let i = t.length - 2; i >= 0; i--) {
        t[i].push(t[i + 1].at(-1) + t[i].at(-1));
    }
    t.Log();
    return t[0].at(-1);
}).Log().Sum().Log();
//1877825184
main_1.Data.map(hist => {
    const o = hist.toIntList(10, ' ');
    const t = [o];
    while (!t.at(-1)?.every(n => n === 0)) {
        const s = t.at(-1);
        const arr = [];
        for (let i = 1; i < s.length; i++)
            arr.push(s[i] - s[i - 1]);
        t.push(arr);
    }
    t.Log();
    t.at(-1).unshift(0);
    for (let i = t.length - 2; i >= 0; i--) {
        t[i].unshift(t[i][0] - t[i + 1][0]);
    }
    t.Log();
    return t[0][0];
}).Log().Sum().Log();
