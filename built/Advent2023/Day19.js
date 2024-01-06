"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
const [workflows, parts] = main_1.DataFull.Split2Lines().Run(w => w.SplitLines().map(l => l.split('{').Run(n => n, w => w.slice(0, -1).split(',').map(r => {
    const a = r.split(':');
    if (a.length === 1)
        return [undefined, a[0]];
    return a.Run(cond => [...(cond.split(/[<>]/).Run(s => s, s => s?.toInt())), cond[1]], dest => dest);
}))).toObject(), p => p.SplitLines().map(l => l.slice(1, -1).split(',').map(a => a.split('=').Run(n => n, n => n.toInt())).toObject()));
//PART 1
parts.reduce((sum, part) => {
    let workflow = 'in';
    while (workflow !== 'A' && workflow !== 'R') {
        for (const [cond, dest] of workflows[workflow]) {
            if (cond === undefined || (cond[2] === '>' ? part[cond[0]] > cond[1] : part[cond[0]] < cond[1])) {
                workflow = dest;
                break;
            }
        }
    }
    return workflow === 'A' ? sum + part.x + part.m + part.a + part.s : sum;
}, 0).Log();
//PART 2
const getConstraintsIn = (conds, i, name) => {
    return [
        conds[i],
        ...conds.slice(0, i).map(c => [c[0], c[1], c[2] === '<' ? '>=' : '<=']),
        ...findConstraints(name),
    ].RemoveUndefined();
};
const memo = new Map([['in', []]]);
const findConstraints = (forname) => {
    if (memo.has(forname))
        return memo.get(forname);
    for (const [name, conds] of workflows.Entries())
        for (let i = 0; i < conds.length; i++)
            if (conds[i][1] === forname) {
                const c = getConstraintsIn(conds.map(c => c[0]), i, name);
                memo.set(forname, c);
                return c;
            }
    throw new Error;
};
let sum = 0;
for (const [name, conds] of workflows.Entries()) {
    for (let i = 0; i < conds.length; i++) {
        if (conds[i][1] === 'A') {
            let ranges = {
                x: [1, 4001],
                m: [1, 4001],
                a: [1, 4001],
                s: [1, 4001],
            };
            const constraints = getConstraintsIn(conds.map(c => c[0]), i, name);
            for (const rating of constraints) {
                const r = ranges[rating[0]];
                if (rating[2] === '>' && rating[1] + 1 > r[0])
                    r[0] = rating[1] + 1;
                else if (rating[2] === '>=' && rating[1] > r[0])
                    r[0] = rating[1];
                else if (rating[2] === '<' && rating[1] < r[1])
                    r[1] = rating[1];
                else if (rating[2] === '<=' && rating[1] + 1 < r[1])
                    r[1] = rating[1] + 1;
            }
            let prod = (ranges['x'][1] - ranges['x'][0]) *
                (ranges['m'][1] - ranges['m'][0]) *
                (ranges['a'][1] - ranges['a'][0]) *
                (ranges['s'][1] - ranges['s'][0]);
            // console.log(name, (ranges['x'][1] - ranges['x'][0]),
            //     (ranges['m'][1] - ranges['m'][0]),
            //     (ranges['a'][1] - ranges['a'][0]),
            //     (ranges['s'][1] - ranges['s'][0]), '=', prod)
            sum += prod;
        }
    }
}
sum.Log();
