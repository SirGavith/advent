"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
const map = new Map(main_1.Data.slice(2).map(r => {
    const l = r.split(' = ');
    return [l[0], l[1].ReplaceMap({ '(': '', ')': '' }).split(', ')];
}));
//part 1
// for (const m of map.entries()) m.Log()
// let currentNode = 'AAA'
// let i = 0
// for ( ; ; i++) {
//     if (currentNode === 'ZZZ') break
//     const dir = Data[0].at(i % Data[0].length)!
//     currentNode = map.get(currentNode)!.at(dir === 'R' ? 1 : 0)!
// }
// i.Log()
//part 2
let currentNodes = main_1.Data.slice(2).map(l => l.slice(0, 3)).filter(l => l.endsWith('A'));
// bf approach
// let j = 0
// for (; ; j++) {
//     if (currentNodes.every(n=> n[2] === 'Z')) break
//     if (j % 1_000_000 === 0) j.Log()
//     const dir = Data[0].at(j % Data[0].length)!
//     const dirIndex = dir === 'R' ? 1 : 0
//     for (let k = 0; k < currentNodes.length; k++) {
//         currentNodes[k] = map.get(currentNodes[k])![dirIndex]
//     }
// }
// j.Log()
//lcm approach
// FDA => HJZ 19199
// BPA => SBZ 11309
// BVA => RFZ 17621
// NDA => VPZ 20777
// AAA => ZZZ 16043
// QCA => PQZ 15517
currentNodes.map(n => {
    let i = 0;
    for (;; i++) {
        if (n.endsWith('Z')) {
            console.log(n, i);
            break;
        }
        const dir = main_1.Data[0].at(i % main_1.Data[0].length);
        n = map.get(n).at(dir === 'R' ? 1 : 0);
    }
    return i;
}).Log()
    .flatMap(n => {
    const factors = [];
    for (let i = 0; i < n; i++)
        if (n % i === 0)
            factors.push(i);
    factors.Log();
    return factors;
}).Uniques().Log().Product().Log();
