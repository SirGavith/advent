import { n2 } from "../Glib/Array";
import { DataFull } from "../main";

type condition = [constraint | undefined, string]
type constraint = readonly ['x' | 'm' | 'a' | 's', number, string]

const [workflows, parts] = DataFull.Split2Lines().Run(
    w => w.SplitLines().map(
            l => l.split('{').Run(
                n => n,
                w => w.slice(0, -1).split(',').map(r => {
                    const a = r.split(':')
                    if (a.length === 1) return [undefined, a[0]]
                    return a.Run(
                        cond => [...(cond.split(/[<>]/).Run(s => s, s => s?.toInt())), cond[1]] as const,
                        dest => dest)
                }))
    ).toObject() as { [key: string]: condition[] },
    p => p.SplitLines().map(
            l => l.slice(1, -1).split(',').map(
                a => a.split('=').Run(n => n, n => n.toInt())).toObject() as {x: number, m: number, a: number, s: number})
)

//PART 1
parts.reduce((sum, part) => {
    let workflow = 'in'
    while (workflow !== 'A' && workflow !== 'R') {
        for (const [cond, dest] of workflows[workflow]) {
            if (cond === undefined || (cond[2] === '>' ? part[cond[0]] > cond[1] : part[cond[0]] < cond[1])) {
                workflow = dest
                break
            }
        }
    }
    return workflow === 'A' ? sum + part.x + part.m + part.a + part.s : sum
}, 0).Log()

//PART 2
const getConstraintsIn = (conds: constraint[], i: number, name: string) => {
    return [
        conds[i],
        ...conds.slice(0, i).map(c => [c[0], c[1], c[2] === '<' ? '>=' : '<=' as string] as constraint),
        ...findConstraints(name),
    ].RemoveUndefined() 
}

const memo = new Map<string, constraint[]> ([['in', []]])

const findConstraints = (forname: string): constraint[] => {
    if (memo.has(forname)) return memo.get(forname)!
    
    for (const [name, conds] of workflows.Entries() as [string, condition[]][])
        for (let i = 0; i < conds.length; i++)
            if (conds[i][1] === forname) {
                const c = getConstraintsIn(conds.map(c => c[0]!), i, name)
                memo.set(forname, c)
                return c
            }
    throw new Error
}


let sum = 0

for (const [name, conds] of workflows.Entries() as [string, condition[]][]) {
    for (let i = 0; i < conds.length; i++) {
        if (conds[i][1] === 'A') {
            
            let ranges = {
                x: [1, 4001],
                m: [1, 4001],
                a: [1, 4001],
                s: [1, 4001],
            }

            const constraints = getConstraintsIn(conds.map(c => c[0]!), i, name)

            for (const rating of constraints) {
                const r = ranges[rating[0]]
                if (rating[2] === '>' && rating[1] + 1 > r[0])
                    r[0] = rating[1] + 1
                else if (rating[2] === '>=' && rating[1] > r[0])
                    r[0] = rating[1]
                else if (rating[2] === '<' && rating[1] < r[1])
                    r[1] = rating[1]
                else if (rating[2] === '<=' && rating[1] + 1 < r[1])
                    r[1] = rating[1] + 1
            }

            let prod = (ranges['x'][1] - ranges['x'][0]) *
                (ranges['m'][1] - ranges['m'][0]) *
                (ranges['a'][1] - ranges['a'][0]) *
                (ranges['s'][1] - ranges['s'][0])

            // console.log(name, (ranges['x'][1] - ranges['x'][0]),
            //     (ranges['m'][1] - ranges['m'][0]),
            //     (ranges['a'][1] - ranges['a'][0]),
            //     (ranges['s'][1] - ranges['s'][0]), '=', prod)

            sum += prod
        }
    }
}

sum.Log()