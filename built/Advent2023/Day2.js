"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
//my part 1
const maxR = 12;
const maxG = 13;
const maxB = 14;
main_1.Data.map((l, i) => {
    const r = l.split(': ')[1].split('; ').some(s => s.split(', ')
        .some(g => {
        const a = g.split(' ');
        return a[1] === 'red' && a[0].toInt() > maxR ||
            a[1] === 'green' && a[0].toInt() > maxG ||
            a[1] === 'blue' && a[0].toInt() > maxB;
    }));
    return r ? 0 : i + 1;
}).Sum();
//my part 2
main_1.Data.map(l => {
    let minR = 0;
    let minG = 0;
    let minB = 0;
    //for each game
    l.split(': ')[1].split('; ').forEach(s => s.split(', ').forEach(g => {
        const a = g.split(' ');
        if (a[1] === 'red')
            minR = Math.max(minR, a[0].toInt());
        if (a[1] === 'green')
            minG = Math.max(minG, a[0].toInt());
        if (a[1] === 'blue')
            minB = Math.max(minB, a[0].toInt());
    }));
    // console.log(minR, minG, minB)
    return minR * minG * minB;
}).Sum();
//condensed part 2
const colors = { 'red': 0, 'green': 1, 'blue': 2 };
main_1.Data.map(l => l.split(': ')[1].split('; ').reduce((mins2, s) => s.split(', ').map(g => g.split(' ')).reduce((mins, a) => mins.With(colors[a[1]], Math.max(mins[colors[a[1]]], a[0].toInt())), mins2), [0, 0, 0]).Product()).Sum().Log();
