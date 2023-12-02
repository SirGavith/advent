"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
//part 1
const charDigits = '0123456789';
// Data.map(l => {
//     const a = l.toArray().filter(c => charDigits.includes(c))
//     return (a[0] + a.at(-1)).toInt()
// }).Sum().Log()
//part 2
const map = new Map([
    ['one', '1'],
    ['two', '2'],
    ['three', '3'],
    ['four', '4'],
    ['five', '5'],
    ['six', '6'],
    ['seven', '7'],
    ['eight', '8'],
    ['nine', '9'],
    ['1', '1'],
    ['2', '2'],
    ['3', '3'],
    ['4', '4'],
    ['5', '5'],
    ['6', '6'],
    ['7', '7'],
    ['8', '8'],
    ['9', '9'],
]);
//my initial approach
main_1.Data.map(l => {
    let first = null, last = null;
    for (let i = 0; i < l.length; i++) {
        const char = l[i];
        for (let j = 0; j < i; j++) {
            if (map.has(l.slice(j, i))) {
                first = map.get(l.slice(j, i));
                break;
            }
        }
        if (first !== null)
            break;
        if (charDigits.includes(char)) {
            first = char;
            break;
        }
    }
    // do last
    for (let i = l.length; i >= 0; i--) {
        const char = l[i];
        if (charDigits.includes(char)) {
            last = char;
            break;
        }
        for (let j = i; j >= 0; j--) {
            if (map.has(l.slice(j, i))) {
                last = map.get(l.slice(j, i));
                break;
            }
        }
        if (last !== null)
            break;
    }
    // console.log(first)
    // console.log(last)
    return (first + last).toInt();
}).Sum().Log();
//wes' approach condensed
main_1.Data.map(l => {
    const d = l.toArray().map((_, i) => {
        for (const a of map.keys())
            if (l.slice(i).startsWith(a))
                return map.get(a);
    }).RemoveUndefined();
    return (d.at(0) + d.at(-1)).toInt();
}).Sum().Log();
//approach 3
const map2 = {
    'one': 'o1e',
    'two': 't2o',
    'three': 't3e',
    'four': 'f4r',
    'five': 'f5e',
    'six': 's6x',
    'seven': 's7n',
    'eight': 'e8t',
    'nine': 'n9e'
};
main_1.Data.map(l => {
    const a = l.ReplaceMap(map2).toArray().filter(c => charDigits.includes(c));
    return (a.at(0) + a.at(-1)).toInt();
}).Sum().Log();
