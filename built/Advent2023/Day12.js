"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
main_1.Data.map(l => {
    const [row, groups] = l.split(' ').Run(r => Array(5).fill(r).join('?').toArray(), g => (g + ',').repeat(5).slice(0, -1).toIntList(10, ','));
    // const [row, groups] = l.split(' ').Run(
    //     r => r.toArray(),
    //     g => g.toIntList(10, ','))
    const totalUnknown = row.Frequency('?');
    const numToSet = groups.Sum() - row.Frequency('#');
    console.log(row.join(''), groups, totalUnknown, numToSet);
    const qs = [];
    for (let i = 0; i < row.length; i++) {
        if (row[i] === '?')
            qs.push(i);
    }
    let count = 0;
    const getGroups = (r, log = true) => {
        const gs = [];
        let currentLen = 0;
        for (let j = 0; j < r.length; j++) {
            if (r[j] === '#')
                currentLen++;
            else if (r[j] === '?')
                break;
            else {
                if (currentLen > 0) {
                    gs.push(currentLen);
                    currentLen = 0;
                }
            }
        }
        if (currentLen > 0) {
            gs.push(currentLen);
        }
        // if (log) console.log(Console.Green, r.join(''), gs, Console.White)
        return gs;
    };
    const recurse = (r, depth = 1, start = 0) => {
        //calc gs up to first ?
        const Ggg = getGroups(r, false);
        for (let i = 0; i < Ggg.length - 1; i++) {
            if (Ggg[i] !== groups[i])
                return;
        }
        if (Ggg[Ggg.length - 1] > groups[Ggg.length - 1])
            return;
        for (let i = start; i < totalUnknown - (numToSet - depth); i++) {
            //let ith ? be set
            const rr = [];
            for (let j = 0; j < r.length; j++)
                rr[j] = r[j] === '?' && j <= i ? '.' : r[j];
            //replace all ?s before i with .
            rr[qs[i]] = '#';
            if (depth < numToSet)
                recurse(rr, depth + 1, i + 1);
            else {
                //check if we satisfy req
                const gs = getGroups(rr);
                if (gs.every((g, k) => g === groups[k])) {
                    // console.log(' '.repeat(depth), rr.join(''), gs)
                    count++;
                }
            }
        }
    };
    recurse(row);
    return count.Log();
}).Sum().Log();
