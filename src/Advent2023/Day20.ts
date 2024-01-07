import { RecursiveArray } from "../Glib/Array"
import { BgBlack, BgGreen, BgRed, Reset, Underscore } from "../Glib/Console"
import { Data } from "../main"

//PART 2 with parsing::
// put a '-' before broadcaster in the input or search for 'roadcaster'

const data = Data.map(l =>
    l.split(' -> ').Run(n => n.slice(1), d => [d].Run(_ => l[0], b => b.split(', ')))
).toObject() as { [key: string]: [string, string[]] }

const r = (m: string): string[] =>
    data[m][1].reduce((arr, d) =>
        data[d][0] !== '&' ? [...arr, d, ...r(d)] : arr
        , [] as string[])

const answer = data['roadcaster'][1].map(d =>
    [d, ...r(d)].reverse()
        .reduce((c, s, _, a) =>
            (c << 1) | (data[s][1].some(d => d === data[a[0]][1][0]) ? 1 : 0)
            , 0)
).Product().Log()



enum PulseType {
    LO, HI
}
enum ModuleType {
    FlipFlopType,
    ConjunctionType
}

class Module {
    type: ModuleType | null = null
    name:string
    destinations: Module[] = []
    inputs: Module[] = []
    strdests: string[]
    pulse(pulseType: PulseType, fromName: string) {
        
    }
    
    constructor(name: string, strdests: string[]) {
        this.name = name
        this.strdests = strdests
    }
}

class FlipFlop extends Module {
    override type = ModuleType.FlipFlopType
    state = false
    public override pulse(pulseType: PulseType) {
        if (pulseType === PulseType.LO) {
            if (this.state) {
                this.state = false
                this.destinations.forEach(d => 
                    pulses.push([d, PulseType.LO, this.name]))
            }
            else {
                this.state = true
                this.destinations.forEach(d =>
                    pulses.push([d, PulseType.HI, this.name]))
            }     
        }
    }
}
    
class Conjunction extends Module {
    override type = ModuleType.ConjunctionType
    memory = new Map<string, PulseType>()

    public override pulse(pulseType: PulseType, fromName: string) {
        this.memory.set(fromName, pulseType)
        let outType = PulseType.LO

        for (const p of this.memory.values()) {
            if (p === PulseType.LO) {
                outType = PulseType.HI
                break
            }
        }

        this.destinations.forEach(d =>
            pulses.push([d, outType, this.name]))
    }
}
    

const pulses: [Module, PulseType, string][] = []

const modules = new Map<string, Module> ()
    
Data.forEach(mod => {
    const [name, dests] = mod.split(' -> ').Run(n => n, d => d.split(', '))
    if (name[0] === '%') {
        modules.set(name.slice(1), new FlipFlop(name.slice(1), dests))
    }
    else if (name[0] === '&') {
        modules.set(name.slice(1), new Conjunction(name.slice(1), dests))
    }
    else {
        modules.set(name, new Module(name, dests))
    }
})

modules.forEach(m => {
    m.destinations = m.strdests.map(name => modules.get(name)).RemoveUndefined()
})
modules.forEach(m => {
    m.destinations.forEach(d => {
        d.inputs.push(m)
        if (d.type === ModuleType.ConjunctionType) {
            (d as Conjunction).memory.set(m.name, PulseType.LO)
        }
    })
})


const findInputs = (name: string, depth: number, exclude: string[] = []) => {
    const arr: RecursiveArray<string> = []
    modules.get(name)?.inputs.forEach(i => {
        if (!exclude.includes(i.name)) {
            // console.log(`${' '.repeat(depth)} ${i.type === ModuleType.ConjunctionType? '|' : '('}${i.name}`)
            arr.push(i.name)
            const e = exclude.CopyFast()
            e.push(i.name)
            arr.push(findInputs(i.name, depth + 1, e))
        }
    })
    return arr
}

const bottoms = ['pf', 'rj', 'tq', 'kx']
const bottomDs = bottoms.map(b => data[b][1].find(o => data[o][0] === '&'))

const cycleLens: {[key: string]: number} = {}


const LogAllState = () => {
    console.clear()
    console.log('Button pushes: ', i)
    console.log('   ┌────' + '──' + '───' + 'broadcaster' + '────' + '──' + '───┐   ')
    console.log('   │    ' + '  ' + '   │    ' + '  ' + '   │    ' + '  ' + '   │   ')
    console.log('   v    ' + '  ' + '   v    ' + '  ' + '   v    ' + '  ' + '   v   ')
    data['roadcaster'][1].map(d => [d, ...r(d)]).Transpose2D().forEach(l => {
        console.log(l.map(name => {
            const left = bottoms.some(b => data[b][1].includes(name))
            const right = bottoms.some(b => data[name][1].includes(b))
            const m = (modules.get(name)! as FlipFlop)

            const str = (left ? '├─>' : '│  ') + (m.state ? BgGreen : BgRed) + name + Reset + (right ? '─>┤' : '  │')
            return str
        }).join('  '))
    })
    console.log(bottoms.map(_ => `│      │`).join('  '))
    console.log(bottoms.map(b => {
        return `└<─${b}<─┘`
    }).join('  '))


    console.log(bottoms.map(_ => `   │    `).join('  '))
    console.log(bottoms.map(b => 
        `   ${data[b][1].find(o => data[o][0] === '&')}   `
    ).join('  '))
    console.log('   │    ' + '  ' + '   │    ' + '  ' + '   │    ' + '  ' + '   │   ')
    console.log('   └────' + '──' + '───┴───>' + 'rg' + '<──┴────' + '──' + '───┘   ')
    console.log('        ' + '  ' + '        ' + '│' + '        ' + '  ' + '       ')
    console.log('        ' + '  ' + '        ' + 'rx' + '        ' + '  ' + '       ')


    console.log(bottoms.map(b => {
        const m = modules.get(b) as Conjunction
        const tot = m.inputs.length
        const c = m.inputs.Count(i => (i as FlipFlop).state)
                return `   ${c}/${tot}  `
    }).join('  '))
    console.log(...bottoms.flatMap(b => {
        return ['P:', (cycleLens[b] ?? ' ?? '), ' ']
    }))


}


// const kdStack = findInputs('qc', 0, ['pf']).flat(12) as string[]
// kdStack.unshift('qc')

// const logState = (i: number) => {
//     let c = 0

//     console.log(i.toString().padEnd(5),
//         kdStack.map(n => {
//             const m = modules.get(n)!
//             if (m.type === ModuleType.FlipFlopType) {
//                 const state = (m as FlipFlop).state

//                 c <<= 1
//                 c |= state ? 1 : 0

//                 return `${state ? BgGreen : BgRed}${m.name}${BgBlack}`
//             }
//         }).join(''),
//         c.toString().padEnd(5),
//         (modules.get('kd')! as Conjunction).memory)
// }
// modules.Log()

const sums = {
    [PulseType.LO]: 0,
    [PulseType.HI]: 0,
}

// console.log('broadcaster -LO =>')

let i = 1
const cycle = () => {
    // console.log('button', i)
    for (let j = 0; j < 15; j++) {
        sums[PulseType.LO]++

        modules.get('broadcaster')!.destinations.forEach(d => pulses.push([d, PulseType.LO, 'broadcaster']))
        
        while (pulses.length > 0) {
            const [module, pulseType, fromName] = pulses.shift()!

            module.pulse(pulseType, fromName)

            bottomDs.forEach((b, k) => {
                if (b === module.name && pulseType === PulseType.LO) {
                    if (!cycleLens[bottoms[k]]) {
                        cycleLens[bottoms[k]] = i
                    }
                }
            })
            if (bottoms.every(b => cycleLens[b])) {
                t.unref()
                LogAllState()
                const periods = cycleLens.Values() as number[]
                console.log('Product: ',periods.Product())
                return
            }

            // console.log(fromName, pulseType === PulseType.LO ? 'LO' : 'HI', '->', module.name)
            sums[pulseType]++
        }

        // bottoms.forEach(b => {
        //     const m = modules.get(b) as Conjunction
        //     const c = m.inputs.Count(i => (i as FlipFlop).state)
        //     if (c === 0 && !cycleLens[b]) {
        //         cycleLens[b] = i
        //     }
        // })
        i++
    }

    LogAllState()
    // if (i % 50000 === 0) i.Log()
}
const t = setInterval(cycle, 30)

    
sums.Log();

// console.log(sums[PulseType.LO] * sums[PulseType.HI])


// modules.get('rx')!.inputs[0].inputs.map(s => {
//     // const stack = findInputs('vv', 0, ['tq']).flat(12) as string[]
//     const conjName = s.inputs[0].name

//     const onesPlace = (findInputs(conjName, 0, [conjName]).flat(15).Uniques() as string[]).reduce(([L, n], s) => {
//         const l = findInputs(s as string, 0, [conjName]).flat(13) as string[]
//         return ((l.length > L.length) ? [l, s]: [L, n] ) as [string[], string]
//     }, [[], ''] as [string[], string])

//     const stack = onesPlace[0]
//     stack.unshift(onesPlace[1])

//     // stack.Log()

//     let c = 0

//     stack.forEach(n => {
//         const m = modules.get(n)!
//         if (m.type !== ModuleType.FlipFlopType) return
//         c <<= 1
//         c |= (m as FlipFlop).destinations.map(d => d.name).includes(conjName) ? 1 : 0
//     })

//     // c.Log()

//     // for (let i = 0; i < c/2; i++) {
//     //     if (c % i === 0) {
//     //         i.Log()
//     //     }
//     // }


//     return c
// }).Product().Log()



// let prod = 1
// for (const [conjName, onesName] of [['tq', 'vv'], ['pf', 'qc'], ['kx', 'jm'], ['rj', 'xv']] as [string, string][]) {
//     const stack = findInputs(onesName, 0, [conjName]).flat(13) as string[]

//     let c = 1
//     for (let i = 0; i < stack.length - 1; i++) {
//         c <<= 1
//         c |= modules.get(stack[i])!.destinations.some(d => d.name === conjName) ? 1 : 0
//     }
//     prod *= c
// }
// prod.Log();
