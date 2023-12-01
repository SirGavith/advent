import { BigMap } from '../Glib/BigMap'
import { LinkedList, LinkedNode } from '../Glib/LinkedList'
import { Stack } from '../Glib/Stack'
import { Array2D as Array2D, XY } from '../Glib/XY'
import { Array3D, XYZ } from '../Glib/XYZ'
import { Filer } from '../Glib/Filer'
import { Sorts } from '../Glib/Sort'
import { Range } from '../Glib/Array'

const UseExample = true
const Data = Filer.ReadAllLines(UseExample ? '../../data/example.txt' : '../../data/input.txt'),
    DataFull = Filer.ReadFile(UseExample ? '../../data/example.txt' : '../../data/input.txt')

export class Advent2021 {
    static Day1() {
        Data.toIntArray()
            .reduce((p, _, i, a) => {
                const c = a.slice(i, i+3).Sum()
                return [p[0] + (c > p[1] ? 1 : 0), c]
            }, [0, Number.MAX_VALUE])[0].Log()
    }
    static Day2() {
        Data.map(s => s.split(' '))
            .reduce((p: number[], v) => {
                const val = v[1].toInt()
                return [
                    p[0] + (v[0] === 'forward' ? val : 0),
                    p[1] + (v[0] === 'forward' ? p[2] * val : 0),
                    p[2] + (v[0] !== 'forward' ? (v[0] === 'down' ? 1 : -1) * val : 0)
                ]
            }, [0, 0, 0]).Log().slice(0, 2).Product().Log()
    }
    static Day3() {
        let oxygen = Data.Copy(),
            co2 = Data.Copy()

        Data.ReduceFilter(
            (n, i) => n[i] === Data.map(x => x[i])
                .sort((a,b) => a.toInt() - b.toInt())
                .MostCommon()
        ).Log()

        for (let i = 0; co2.length > 1; i++) {
            const mc = co2.map(x => x[i])
                .sort((a,b) => a.toInt() - b.toInt())
                .LeastCommon()
            co2 = co2.filter(n => n[i] === mc)
        }

        (oxygen[0].toInt(2) * co2[0].toInt(2)).Log()
    }
    static Day4() {
        const d = DataFull.split('\n\n'),

            randoms = d[0].split(',').toIntArray(),

            boards = d.slice(1).map(b => { return {
                bingo: false,
                board: b.SplitLines().map(l => 
                    l.replaceAll('  ', ' ').trim().split(' ')
                    .toIntArray()
                    .map(i => { return { value: i, marked: false }})
                ) } }
            )

        for (const rand of randoms) {
            for (const board of boards.filter(b => !b.bingo)) {
                //mark tiles
                board.board.forEach(row => 
                    row.forEach(t => 
                        (t.value === rand).IsTrue(() => t.marked = true)))

                //check bingos
                for (let i = 0; i < 5; i++) {
                    const row = board.board[i],
                        col = board.board.map(row => row[i])
  
                    if (col.every(t => t.marked) || row.every(t => t.marked))
                        board.bingo = true
                }

                if (boards.every(b => b.bingo))
                // if (board.bingo)
                    return (board.board.Log().flat()
                            .filter(t => !t.marked)
                            .reduce((s, c) => s + c.value, 0).Log()
                        * rand.Log()).Log()
            }
        }
    }
    static Day5() {
        const d = Data.map(d => {
                const dd = d.split(' -> ').map(a => a.split(',').toIntArray())
                return {
                    x1: dd[0][0],
                    y1: dd[0][1],
                    x2: dd[1][0],
                    y2: dd[1][1],
                }
            }).Log(),
            map: number[][] = []

        for (const p of d)
            if (p.x1 === p.x2) //vertical
                Range(p.y1, p.y2).forEach(n =>
                    map.IncrementOrCreate2D(n, p.x1))
            else if (p.y1 === p.y2) //horizontal
                Range(p.x1, p.x2).forEach(n =>
                    map.IncrementOrCreate2D(p.y1, n))
            else //diagonal
                for (let i = 0; i <= Math.abs(p.x1 - p.x2); i++)
                    map.IncrementOrCreate2D(
                        p.y1 + (p.y1 > p.y2 ? -i : i),
                        p.x1 + (p.x1 > p.x2 ? -i : i))

        const len = map.reduce((p, c) => c.length > p ? c.length : p, 0)
        map.FillEmpty([]).forEach(r =>
            r.FillEmpty(0, len)
            .map(t => t === 0 ? '.' : t.toString()).join('').Log())

        map.flat().Count(c => c >= 2).Log()
    }
    static Day6_naive() {
        let school = Data[0].split(',').toIntArray().Log()

        for (let i = 0; i < 18; i++) {
            i.Log()
            school.forEach((fish, ii) => {
                if (fish === 0) {
                    school.push(8)
                    school[ii] = 6
                }
                else school[ii]--
            })
                
            school.Log()
        }
    }
    static Day6_revised() {
        const school: bigint[] = Array(9).fill(BigInt(0))
        Data[0].split(',').toIntArray().forEach(f => school[f]++)

        for (let i = 0; i < 2560; i++) {
            let parents = school.shift()!
            school[6] += parents
            school[8] = parents
        }
        school.Sum().Log()
    }
    static Day7() {
        const d = Data[0].split(',').toIntArray().Log()

        Range(0, Math.max(...d)) //could binary search
            .map(i =>
                d.map(crab => {
                    const n = Math.abs(crab - i)
                    return n * (n + 1) / 2
                }).Sum())
            .reduce((prev:number[], cur, i) =>
                prev[0] > cur ? [cur, i] : prev,
            [Number.MAX_VALUE, 0]).Log()
    }
    static Day8() { 
        const d = Data.map(display => display.split(' | ')
            .map(d => d.split(' ').map(a => a.toArray()))),
            sevenSegs = {
                'ABCEFG': 0,
                'CF': 1,
                'ACDEG': 2,
                'ACDFG': 3,
                'BCDF': 4,
                'ABDFG': 5,
                'ABDEFG': 6,
                'ACF': 7,
                'ABCDEFG': 8,
                'ABCDFG': 9,
            },
            validSegments = Object.keys(sevenSegs),
            wires = 'abcdefg'.toArray(),
            perms = 'ABCDEFG'.toArray().Permutations(),
            mapDigit = (d: string[], map: {[x: string]: any}) => d.map(wire => map[wire]).sort(Sorts.Alphabetical).join('')
            
        d.reduce((count, cur) => {
            const [signals, segments] = cur

            for (const perm of perms) {     //loop through all wire => segment mappings
                const map: {[key: string]: string} = perm.map((val, i) => [wires[i], val]).toObject()

                if(signals.every(digit => validSegments.includes(mapDigit(digit, map))))
                    return count + segments.map(digit =>    //count the output of those which can decode all signals into digits
                        sevenSegs[mapDigit(digit, map) as keyof typeof sevenSegs]).join('').toInt()
            }
            throw new Error('Could not find successful permutation')
        }, 0).Log()
    }
    static Day9() {
        const d = Array2D.fromArray(Data.map(d => d.toArray().toIntArray())),
            basins: XY[] = []

        d.forEach((tile, xy) => {
            if (tile != undefined && d.Neighbours(xy).Values().every(n => n > tile)) {
                basins.push(xy)
            }
        })

        basins.map(basin => {
            const b = new Set<string>().add(basin.toString())

            for (const bb of b) {
                d.Neighbours(XY.fromString(bb)).forEach(t => (t[1] < 9).IsTrue(() => b.add(t[0].toString())))
            }

            return b.size
        }).sort(Sorts.GreatestFirst).slice(0, 3).Product().Log()
    }
    static Day10() {
        const invertBracket: {[b: string]: '>'|'}'|']'|')'} = {
            '(': ')',
            '[': ']',
            '{': '}',
            '<': '>'
        }
        Data.map(line => {
            var stack = new Stack<string>()

            for (const c of line.toArray()) {
                if (c.in('([{<')) {
                    stack.Push(c)
                } else if (stack.Count === 0 || invertBracket[stack.Pop()!] !== c) {
                    return undefined //corrputed
                }
            }
            return stack.Array.reverse()
                .reduce((a, c) =>
                a * 5 + {
                    ')': 1,
                    ']': 2,
                    '}': 3,
                    '>': 4
                }[invertBracket[c]], 0)
        }).RemoveUndefined().Log().Median().Log()
    }
    static Day11() {
        interface Octopus {
            energy: number
            flashed: boolean
        }
        const octstep = (octopus : [XY, Octopus]) => {
            const o = octopus[1]
            if (!o.flashed && o.energy > 9) {
                o.flashed = true

                s.Neighbours(octopus[0], true).forEach(oo => {
                    oo[1].energy++
                    octstep(oo)
                })
            }
        }

        let s = Array2D.fromArray(Data.map(l => l.toArray().toIntArray())).map(e => ({energy: e!, flashed: false}))

        for (let i = 1; ; i++) {
            s.forEach(octopus => {
                octopus!.flashed = false
                octopus!.energy++
            })

            s.forEach((octopus, xy) => octstep([xy, octopus!]))

            if (s.Array.flat().every(o => o?.flashed)) {
                i.Log()
                return
            }

            s.forEach(octopus => {
                if(octopus!.flashed) {
                    octopus!.energy = 0
                }
            })
        }
    }
    static Day12() {
        let d = Data.map(l => l.split('-')),
            dFull = d.flatMap(l => [l, l.Copy().reverse()]),
            adjacents: {[node: string]: string[]} = d.flat().Uniques().Log().map(node => [node, dFull.filter(edge => edge[0]===node).map(e => e[1]).filter(e => e != 'start')]).toObject().Log()

        let paths = 0,
            step = (path: string[]) => {
                for (const cave of adjacents[path.at(-1)!]) {
                    if (cave === 'end') {
                        paths++
                        continue
                    }
                    else if (cave.charCodeAt(0) <= 90 ||
                        //lower case
                        !path.includes(cave) ||
                        //already been there once
                        path.filter(c => c.charCodeAt(0) >= 97).MaxFrequency() < 2) {

                        step(path.concat(cave))
                    }
                }
            }

        step(['start'])

        paths.Log()
    }
    static Day13() {
        const [ps, fs] = DataFull.split('\n\n').map(n => n.SplitLines()),
            pairs = ps.map(d => d.split(',').toIntArray() as [number, number]),
            folds = fs.map(f => f.split(' ').at(-1)!.split('=') as [string, string])

        let paper = new Array2D<boolean>(new XY(
            pairs.map(p => p[0]).Max() + 1,
            pairs.map(p => p[1]).Max() + 1))
        
        pairs.forEach(pair => paper.set(new XY(pair[0], pair[1]), true))

        for (const fold of folds) {
            const newPaper = new Array2D<boolean>(new XY(
                fold[0]==='x'?(paper.Size.X-1)/2 : paper.Size.X,
                fold[0]==='y'?(paper.Size.Y-1)/2 : paper.Size.Y))

            paper.forEach((dot, xy) => {
                const foldPos = fold[1].toInt()
                if (dot) {
                    newPaper.set(
                        fold[0] === 'x'
                            ? (xy.X > foldPos ? new XY(foldPos-(xy.X-foldPos), xy.Y) : xy)
                            : (xy.Y > foldPos ? new XY(xy.X, foldPos-(xy.Y-foldPos)) : xy),
                        dot)
                }
            })
            paper = newPaper
        }

        paper.Log()
    }
    static Day14() {
        const [template, r] = DataFull.split('\n\n').map(p => p.SplitLines()),
            polymer = template[0].Log().toArray(),
            rules = r.map(rule => rule.split(' -> ')).toObject().Log() as {[key: string]: string},
            freqs: {[key: string]:number} = {}

        polymer.forEach(e => {
            if(freqs[e]) freqs[e]++
            else freqs[e] = 1
        })
        for (let i = 0; i < 20; i++) {
            polymer.reduceRight((_, char, i) => {
                if (i === polymer.length - 1) return 0

                const e = rules[char+polymer[i+1]]
                polymer.splice(i+1, 0, e)

                if(freqs[e]) freqs[e]++
                else freqs[e] = 1

                return 0
            }, 0)
            console.log(i, polymer.length)
        }

        const f = freqs.Values();
        (f.Max() - f.Min()).Log()
    }
    static Day14_revised() {
        const [template, r] = DataFull.split('\n\n').map(p => p.SplitLines()),
            poly = template[0].Log().toArray(),
            rules = r.map(rule => rule.split(' -> ')).toObject().Log() as {[key: string]: string},
            polymer = new LinkedList<string>(),
            freqs: {[key: string]:number} = {}


        poly.forEach(char => {
            polymer.Push(new LinkedNode(char))
        })

        poly.forEach(e => {
            if(freqs[e]) freqs[e]++
            else freqs[e] = 1
        })

        polymer.toString().Log()

        for (let i = 0; i < 40; i++) {
            let node = polymer.Head
            while (node?.Next) {
                const e = rules[node.Value + node.Next.Value]
                if (!e) throw new Error('could not find rule')
                node.InsertAfter(new LinkedNode(e))
                node = node.Next.Next

                if(freqs[e]) freqs[e]++
                else freqs[e] = 1
            }
            i.Log()
            freqs.Log()
        }

        const f = freqs.Values();
        (f.Max() - f.Min()).Log()
    }
    static Day14_revised_revised() {
        const [template, r] = DataFull.split('\n\n').map(p => p.SplitLines()),
            rules = r.map(rule => rule.split(' -> ')).toObject() as {[key: string]: string},
            emptyFreqs = rules.Keys().map(v => [v, 0]),
            letterfreqs: {[key: string]: number} = {}

        let freqs: {[key: string]:number} = emptyFreqs.toObject()

        template[0].toArray().forEach((e, i, a) => {
            letterfreqs.IncrementOrCreate(e)
            if (i+1!==a.length)
                freqs.IncrementOrCreate(e+a[i+1])
        })

        // const time = process.hrtime(startTime)
        // console.log(`half in ${time[0]}s ${time[1]/1_000_000}ms`)

        for (let i = 0; i < 40; i++) {
            const newFreqs = emptyFreqs.toObject() as {[key: string]: number}
            for (const [pair, count] of freqs.Entries().filter(t => t[1] > 0)) {
                const e = rules[pair]
                newFreqs[pair.charAt(0)+e] += count
                newFreqs[e+pair.charAt(1)] += count

                letterfreqs.IncrementOrCreate(e, count)
            }
            freqs = newFreqs
        }

        // const time2 = process.hrtime(startTime)
        // console.log(`looped in ${time2[0]}s ${time2[1]/1_000_000}ms`)

        const f = letterfreqs.Values();
        (f.Max() - f.Min()).Log()
    }
    static Day15() {
        const d = Array2D.fromArray(Data.map(l => l.toArray().toIntArray())),
            lastE = d.Size.minus(1)
        let smallestPath = Number.MAX_VALUE,
            steps = 0
        const bestRoute = (xy: XY, score = 0) => {
            if (score > smallestPath) return
        
            if (xy.EQ(lastE)) {
                if (score < smallestPath) {
                    smallestPath = score
                    console.log('Smallest:', score)
                    steps++
                }
                return
            }

            const xp = xy.plus(1, 0),
                yp = xy.plus(0, 1),

                xVal = d.get(xp),
                yVal = d.get(yp)

            if (xVal && yVal) {
                if (xVal > yVal) {
                    bestRoute(yp, score + yVal)
                    bestRoute(xp, score + xVal)
                } 
                else {
                    bestRoute(xp, score + xVal)
                    bestRoute(yp, score + yVal)
                }
            }
            else {
                if (xVal) bestRoute(xp, score + xVal)
                if (yVal) bestRoute(yp, score + yVal)
            }            
        }


        d.Log()    
        bestRoute(new XY)
        console.log(steps, 'steps')   

    }
    static Day15_revised() {
        const d = Array2D.fromArray(Data.map(l => l.toArray().toIntArray())),
            bestScore: Array2D<number> = new Array2D(d.Size),
            lastE = d.Size.minus(1)

        let n = [lastE.minus(1, 0), lastE.minus(0, 1)]

        bestScore.set(lastE, d.get(lastE))

        // d.Log() 
        // bestScore.Log()

        main_loop: while (true) {
            const newN: XY[] = []
            for (const xy of n) {
                bestScore.set(xy, [
                    bestScore.get(xy.plus(1, 0)),
                    bestScore.get(xy.plus(0, 1))]
                        .RemoveUndefined().Min() + d.get(xy)!
                )
                const left = xy.minus(1, 0)
                if (left.X >= 0) newN.push(left)
                else if (xy.EQ(new XY)) break main_loop
            }
            const up = n.at(-1)!.minus(0, 1)
            if (up.Y >= 0) newN.push(up)

            n = newN
            bestScore.Log()
        }

        [bestScore.get(new XY(1, 0)),
        bestScore.get(new XY(0, 1))].Min()?.Log()
    }
    static Day15_revised_revised() {
        const d = Array2D.fromArray(Data.map(l => l.toArray().toIntArray())),
            bestScore: Array2D<number> = new Array2D(d.Size),
            lastE = d.Size.minus(1)

        bestScore.set(new XY, 0)

        d.Log()

        // for (let i = 1; ; i++) {
        //     for (let j = 0; j < i + 1; j++) {
        //         const xy = new XY(i - j, j),
        //             val = d.get(xy)!
        //         if (!val) continue

        //         const min = [
        //             bestScore.get(xy.minus(1, 0)),
        //             bestScore.get(xy.minus(0, 1)),
        //         ].RemoveUndefined().Min()

        //         bestScore.set(xy, val + min)
        //         if (xy.EQ(lastE)) {
        //             bestScore.Log()

        //             console.log(val + min)
        //             return
        //         }
        //     }
        //     bestScore.Log()
        // }
    }
    static Day15_revised_revised_revised() {

        interface Node {
            distance: number
            visited: boolean
            weight: number
        }

        const d = Array2D.fromArray(
            Data.map(l =>
                l.toArray().toIntArray().map(e =>
                    ({weight: e, visited: false, distance: Number.POSITIVE_INFINITY} as Node))))
            
        
        const dd = new Array2D<Node>(d.Size.times(5)),
            lastE = dd.Size.minus(1)

        d.forEach((val, xy) => {
            if (!val) return

            for (let i = 0; ; i++) {

                for (let j = 0; j < i + 1; j++) {
                    const newxy = new XY(i - j, j)
                    
                    if (newxy.IsLessBoth(new XY(5))) {
                        dd.set(newxy.times(d.Size).plus(xy), val.Copy() as Node)
                        if (newxy.EQ(new XY(4))) return
                    }
                }
                // dd.map(val => val?.weight).Log()

                val.weight++
                if (val.weight % 10 === 0)
                    val.weight = 1

            }
        })

        dd.map(val => val?.weight).Log()

        const unvistied = dd.Entries().filter(n => !n[1].visited)
        dd.get(new XY)!.distance = 0
        
        let currentNode = new XY
        for (let i = 0; ; i++) {
            if (currentNode.EQ(lastE)) {
                dd.get(currentNode)!.distance.Log()
                break
            }

            const node = dd.get(currentNode)!;

            [currentNode.plus( 1, 0),
            currentNode.plus(-1,  0),
            currentNode.plus( 0,  1),
            currentNode.plus( 0, -1)]
                .forEach(neighbour => {
                    const n = dd.get(neighbour)
                    if (n && !n.visited) {
                        n.distance = [n.distance, node.distance + n.weight].Min()
                    }
                })
            node.visited = true
            unvistied.splice(unvistied.findIndex(val => val[0].EQ(currentNode)), 1)
            
            currentNode = unvistied.reduce((least, val) => {
                if (val[1].distance < least[1].distance) least = val
                return least
            }, [new XY, {distance: Number.MAX_VALUE}] as [XY, Node])[0]


            dd.map(e => e?.distance).Log()
            if (unvistied.length % 100 === 0)
                unvistied.length.Log()
        }
    }
    static Day16() {
        const line = Data[0].toArray().map(char => char.toInt(16).toString(2).padStart(4, '0')).join('')

        class Packet {
            Version: number
            TypeId: number
            LiteralValue?: number
            SubPackets: Packet[] = []

            private Position: number

            constructor(bits: string, position = 0) {
                this.Version = bits.slice(position, position + 3).toInt(2)
                this.TypeId = bits.slice(position + 3, position + 6).toInt(2)
                this.Position = position + 6

                if (this.TypeId === 4) {
                    //literal
                    const values = []
                    do {
                        values.push(bits.slice(this.Position, this.Position += 5))
                    } while (values.at(-1)!.charAt(0) === '1')

                    this.LiteralValue = values.map(v => v.slice(1)).join('').toInt(2)
                }
                else {
                    //operator
                    const lenType = bits.charAt(this.Position++).toInt(),
                        lenTypeSize = lenType === 0 ? 15 : 11,
                        subPacketSize = bits.slice(this.Position, this.Position += lenTypeSize).toInt(2)

                    let p: Packet | undefined
                    do {
                        p = new Packet(bits, p?.Position ?? this.Position)
                        this.SubPackets.push(p)
                    } while ((lenType === 0 ? p.Position - this.Position : this.SubPackets.length) < subPacketSize)

                    this.Position = p.Position
                }
            }

            SumVersions: () => number = () => this.Version + this.SubPackets?.reduce((a, v) => a + v.SumVersions(), 0) ?? 0

            Operate(): number {
                if (this.LiteralValue) return this.LiteralValue

                const children = this.SubPackets!.map(p => p.Operate())

                switch (this.TypeId) {
                    case 0: //sum
                        return children.Sum()
                    case 1: //product
                        return children.Product()
                    case 2: //minimum
                        return children.Min()
                    case 3: //maximum
                        return children.Max()
                    case 5: //greaterThan
                        return children[0] > children[1] ? 1 : 0
                    case 6: //lessThan
                        return children[0] < children[1] ? 1 : 0
                    case 7: //equalTo
                        return children[0] === children[1] ? 1 : 0
                    default:
                        throw new Error('Bad TypeId ' + this.TypeId)
                }
            }
        }

        const packets = new Packet(line)
        packets.Log()
        packets.Operate().Log()
        packets.SumVersions().Log()
    }
    static Day17() {
        const t = Data[0].split(': ')[1].split(', ').map(p => XY.fromTuple(p.slice(2).split('..').toIntArray() as [number, number])),
            target: [XY, XY] = [new XY(t[0].Least, t[1].Least), new XY(t[0].Greatest, t[1].Greatest)]

        const IsValid = (velocity: XY) => {
            const position = new XY
            while (position.X < target[1].X && position.Y > target[0].Y) {
                position.plusEQ(velocity)
                velocity.plusEQ(
                    velocity.X > 0 ? -1 : velocity.X === 0 ? 0 : 1,
                    -1)

                if (position.WithinBounds(...target)) return true
            } 
            return false
        }

        const xy = new XY
        while (!xy.X.SumOfLess().InRangeEq(target[0].X, target[1].X)) xy.X++
        while (xy.Y + 1 < Math.abs(target[0].Y)) xy.Y++

        //x must be in rangeEQ(x, tuple[1].X)
        //y must be in rangeEQ(tuple[0].Y, y)


        new XY(target[1].X, xy.Y).CountCombinations(xy => IsValid(xy), new XY(xy.X, target[0].Y)).Log()
    }
    static Day18() {
        type SnailTuple = [Snail | number, Snail | number]
        class Snail {
            Tuple: SnailTuple

            constructor(tupleNumber: SnailTuple | string) {
                if (typeof tupleNumber === 'string') {
                    let snailNumber = tupleNumber
                    let parseDepth = 0,
                        delimiterPos
                        snailNumber = snailNumber.slice(1, -1)
                    for (const [char, i] of snailNumber.toArray().WithIndices()) {
                        if (char === '[') parseDepth++
                        else if (char === ']') parseDepth--
                        else if (char === ',' && parseDepth === 0) {
                            delimiterPos = i
                            break
                        }
                    }
                    if (!delimiterPos) throw new Error('Could not find delimiter in '+snailNumber)

                    const tuple = [snailNumber.substring(0, delimiterPos),
                        snailNumber.substring(delimiterPos + 1)]

                    this.Tuple = tuple.map(t => !isNaN(t.toInt()) ? t.toInt() : new Snail(t)) as SnailTuple
                }
                else {
                    this.Tuple = tupleNumber
                }
            }

            Copy(): Snail {
                return new Snail([typeof this.Tuple[0] === 'number' ? this.Tuple[0] : this.Tuple[0].Copy(),
                    typeof this.Tuple[1] === 'number' ? this.Tuple[1] : this.Tuple[1].Copy()])
            }

            Add(snail: Snail) {
                const s = new Snail([this, snail]).Copy()
                s.Reduce()
                return s
            }

            AddFirst(n: number) {
                if (typeof this.Tuple[0] === 'number') this.Tuple[0] += n
                else this.Tuple[0].AddFirst(n)
            }
            AddLast(n: number) {
                if (typeof this.Tuple[1] === 'number') this.Tuple[1] += n
                else this.Tuple[1].AddLast(n)
            }

            Magnitude(): number {
                return 3 * (typeof this.Tuple[0] === 'number' ? this.Tuple[0] : this.Tuple[0].Magnitude())
                + 2 * (typeof this.Tuple[1] === 'number' ? this.Tuple[1] : this.Tuple[1].Magnitude())
            }

            TryExplode(depth = 0): [number, number, boolean] /** exploded */ {
                if (depth >= 3) {

                    if (typeof this.Tuple[0] !== 'number') {
                        const addNumbers = this.Tuple[0].Tuple as [number, number]
                        if (typeof this.Tuple[1] === 'number') this.Tuple[1] += addNumbers[1]
                        else this.Tuple[1].AddFirst(addNumbers[1])
                        this.Tuple[0] = 0
                        return [addNumbers[0], 0, true]
                    }

                    if (typeof this.Tuple[1] !== 'number') {
                        const addNumbers = this.Tuple[1].Tuple as [number, number]
                        this.Tuple[0] += addNumbers[0]
                        this.Tuple[1] = 0
                        return [0, addNumbers[1], true]
                    }
                }

                if (typeof this.Tuple[0] !== 'number') {
                    const addNumbers = this.Tuple[0].TryExplode(depth + 1)
                    if (addNumbers[0] > 0) return addNumbers
                    if (addNumbers[1] > 0) {
                        if (typeof this.Tuple[1] === 'number') this.Tuple[1] += addNumbers[1]
                        else this.Tuple[1].AddFirst(addNumbers[1])
                        return [0, 0, true]
                    }
                    if (addNumbers[2]) return [0, 0, true]
                }
                
                if (typeof this.Tuple[1] !== 'number') {
                    const addNumbers = this.Tuple[1].TryExplode(depth + 1)
                    if (addNumbers[0] > 0) {
                        if (typeof this.Tuple[0] === 'number') this.Tuple[0] += addNumbers[0]
                        else this.Tuple[0].AddLast(addNumbers[0])
                        return [0, 0, true]
                    }
                    if (addNumbers[1] > 0) return addNumbers
                    if (addNumbers[2]) return [0, 0, true]
                }

                return [0, 0, false]

            }

            TrySplit(): boolean {
                if (typeof this.Tuple[0] === 'number' && this.Tuple[0] >= 10) {
                    this.Tuple[0] = new Snail([Math.floor(this.Tuple[0]/2), Math.ceil(this.Tuple[0]/2)])
                    return true
                }
                else if (typeof this.Tuple[0] !== 'number' && this.Tuple[0].TrySplit()) {
                    return true
                }

                if (typeof this.Tuple[1] === 'number' && this.Tuple[1] >= 10) {
                    this.Tuple[1] = new Snail([Math.floor(this.Tuple[1]/2), Math.ceil(this.Tuple[1]/2)])
                    return true
                }
                else if (typeof this.Tuple[1] !== 'number' && this.Tuple[1].TrySplit()) {
                    return true
                }

                return false
            }

            Reduce() {
                while (true) {
                    if (this.TryExplode()[2]) continue
                    else if (this.TrySplit()) continue
                    break
                }
            }

            toString(): string {
                return `[${this.Tuple.map(t => typeof t === 'number' ? t : t.toString()).join(',')}]`
            }
            Log(): Snail {
                console.log(`🐌 ${this.toString()}`)
                return this
            }
        }

        const snails = Data.map(l => new Snail(l))

        // snails.reduce((a, b) => a.Add(b).Log()).Log().Magnitude().Log()

        let max = 0
        snails.forEach((s, i) => {
            snails.forEach((ss, ii) => {
                if (i !== ii) {
                    max = [s.Add(ss).Magnitude(), max].Max()
                }
            })
        })
        max.Log()
    }
    static Day19() {
        class Scanner {
            Orientations: Beacons[] = []
            AbsoluteOrientation?: number
            Neighbours: [Scanner, XYZ][] = []
            constructor(b: XYZ[], public Index: number) {
                const ors = b.map(xyz => xyz.Orientations())
                for (let i = 0; i < 24; i++) {
                    this.Orientations.push(new Beacons(ors.map(o => o[i])))
                }
            }
            toString() {
                return this.Orientations.map(b => b.toString()).map(s => '  '+s).join('\n')
            }
            Log() {
                console.log('{')
                this.Orientations.forEach(b => b.toString().Log())
                console.log('}')
                return this
            }

            Overlap(s: Scanner): [XYZ, number] | null {
                let i = 0
                for (const o of s.Orientations) {
                    //assert match
                    const overlap = this.Orientations[this.AbsoluteOrientation!].Overlap(o)
                    if (overlap !== null) {
                        return [overlap, i]
                    }
                    i++
                }
                //no overlap
                return null
            }

            MergePoints(translation = new XYZ) {
                let list: XYZ[] = this.Orientations[this.AbsoluteOrientation!].Beacons.map(p => p.plus(translation))
                for (const n of this.Neighbours) {
                    list = list.concat(n[0].MergePoints(n[1].plus(translation)))
                }
                return list
            }

            Translations(translation = new XYZ) {
                let list: XYZ[] = [translation]
                for (const n of this.Neighbours) {
                    list = list.concat(n[0].Translations(n[1].plus(translation)))
                }
                return list
            }
        }
        class Beacons {
            Beacons: XYZ[]
            constructor(b : XYZ[]) {
                this.Beacons = b
            }
            toString() {
                return '  🥓'+this.Beacons.map(xyz => xyz.toString()).join(' | ')
            }

            Overlap(otherBeacons: Beacons) {
                // assert xyz pair
                // see if b translated by the offset produces 12 matching xyzs
                for (const b of this.Beacons) {
            
                    for (const bb of otherBeacons.Beacons) {
                        let matches = 0
                        //assert b === bb
                        const translation = b.minus(bb)
                        //number of elements in translateed that are equal to those in this
                        
                        for (const bbb of this.Beacons) {
                            const bbbtranslated = bbb.minus(translation)
                            for (const bbbb of otherBeacons.Beacons) {
                                if (bbbb.EQ(bbbtranslated)) {
                                    matches++
                                    if (matches >= overlap) return translation
                                }
                            }
                        }
                    }

                }
                return null
            }

            Log() {
                this.toString().Log()
                return this
            }
        }


        const scanners = DataFull.split('\n\n').map((scannerData, i) =>
            new Scanner(scannerData.SplitLines().slice(1).map(l =>
                XYZ.fromTuple(l.split(',').toIntArray() as [number, number, number])), i))
        const overlap = 12
        

        // d[0].Orientations[0].Log().Overlap(d[1].Orientations[0].Log()).Log()
        const head = scanners[0]
        head.AbsoluteOrientation = 0

        const findNeighbors = (s: Scanner, possibleNeighbors: Scanner[]) => {
            console.log('finding neighbors', s.Index)
            for (const ss of possibleNeighbors) {
                console.log(' finding overlap with', ss.Index)
                const overlap = s.Overlap(ss)
                if (overlap !== null) {
                    ss.AbsoluteOrientation = overlap[1]
                    s.Neighbours.push([ss, overlap[0]])
                }
            }
            for (const ss of s.Neighbours) {
                possibleNeighbors.splice(possibleNeighbors.indexOf(ss[0]), 1)
            }

            console.log('found', possibleNeighbors.length, 'options')
            // possibleNeighbors = possibleNeighbors.filter(n => !s.Neighbours.map(nn => nn[0]).includes(n))

            s.Neighbours.forEach(n => {
                findNeighbors(n[0], possibleNeighbors)
            })
        }

        findNeighbors(head, scanners.slice(1))

        // const l = toTranslations(head)

        const s = new Set<string>()

        const merged = head.MergePoints()
        
        merged.forEach(xyz => s.add(xyz.toString()))

        const trans = head.Translations().Log()
        let max = 0
        trans.forEach(t => {
            trans.forEach(tt => {
                const manhattan = t.ManhattanDist(tt)
                if (manhattan > max) max = manhattan
            })
        })

        // Array.from(s).sort((a, b) => a.slice(1).split(',')[0].toInt() - b.slice(1).split(',')[0].toInt()).Log()

        s.Log()

        s.size.Log()

        max.Log()
        

    }
    static Day20() {
        const algorithm = Data[0].toArray().map(char => char === '#')
        let image = Array2D.fromArray<boolean>(Data.slice(2).map(l => l.toArray().map(char => char === '#')))
        image = new Array2D<boolean>(image.Size.plus(2)).map((_, xy) => image.get(xy.minus(1)))

        for (let i = 0; i < 8; i++) {
            image = new Array2D<boolean>(image.Size.plus(2)).map((_, xy) => 
                algorithm[xy.minus(1).Neighbourhood(true).map(xy => image.get(xy) ? '1' : '0').join('').toInt(2)])
            
            if (i % 2 === 1) {
                image.Array = [
                    Array(image.Size.X).fill(false),
                    Array(image.Size.X).fill(false),
                    ...image.Array.slice(2, -2).map(l => l.slice(0, -2).concat([false, false])),
                    Array(image.Size.X).fill(false),
                    Array(image.Size.X).fill(false),
                ]
            }
        }


        

        image.Flatten().Count().Log()
        // image.Array.ReduceSum(r => r.Count()).Log()
    }
    static Day21() {

        const die = {
            Val: 1,
            Rolls: 0,
            Next: function() {
                const out = this.Val
                this.Val %= 100
                this.Val++
                this.Rolls++
                return out
            }
        }
        class Player {
            Name: number
            Position: number
            Score: number

            constructor(name: number, position: number) {
                this.Name = name
                this.Position = position
                this.Score = 0
            }

            Turn() {

                const rolls = [die.Next(), die.Next(), die.Next()]

                this.Position += rolls.Sum()
                this.Position %= 10
                if (this.Position === 0) this.Position = 10
                this.Score += this.Position

                console.log(`p${this.Name}: ${rolls.join('+')} (${die.Rolls}) => ${this.Position} | ${this.Score}`)

                return this.Score >= 21
            }
        }

        const players = [
            new Player(1, 2),
            new Player(2, 1)
        ]

        game: while (true) {
            for (const player of players) {
                if (player.Turn()) break game
            }
        }
        players.Log()
        die.Rolls.Log()

        console.log(die.Rolls * players.map(p => p.Score).Min())

    }
    static Day21_2() {
        const r = Range(3, 9).map(v => [v, 0]).toObject() as {[roll: number]: number}
        for (let r1 = 1; r1 <= 3; r1++) {
            for (let r2 = 1; r2 <= 3; r2++) {
                for (let r3 = 1; r3 <= 3; r3++) {
                    r[r1+r2+r3]++
                }
            }
        }
        const rolls = r.Entries().map(e => [e[0].toInt(), BigInt(e[1])] as [number, bigint])
        rolls.Log()

        const wins = [0n, 0n]

        class Game {
            constructor(public Position1: number,
                        public Score1: number,
                        public Position2: number,
                        public Score2: number) { }

            Move(player: 1 | 2, length: number) {
                if (player === 1) {
                    this.Position1 += length
                    this.Position1 %= 10
                    if (this.Position1 === 0) this.Position1 = 10
                    this.Score1 += this.Position1
                    if (this.Score1 >= 21) return true

                } else {
                    this.Position2 += length
                    this.Position2 %= 10
                    if (this.Position2 === 0) this.Position2 = 10
                    this.Score2 += this.Position2
                    if (this.Score2 >= 21) return true
                }
                return false
            }

            Copy() {
                return new Game(this.Position1, this.Score1, this.Position2, this.Score2)
            }

            toString() {
                return `${this.Position1},${this.Score1},${this.Position2},${this.Score2}`
            }

            static fromString(s: string) {
                const ss = s.split(','),
                    sss = ss.toIntArray()

                return new Game(sss[0], sss[1], sss[2], sss[3])
            }
        }

        let list: {[game: string]: bigint} = {}

        list[new Game(2, 0, 1, 0).toString()] = 1n

        while (list.Entries().length > 0) {
            const newList: typeof list = {}
            list.forEach((g, freq: bigint) => {
                const game = Game.fromString(g)

                for (const [roll1, rollf1] of rolls) {
                    const g = game.Copy()
                    if (g.Move(1, roll1)) wins[0] += freq * rollf1
                    else {
                        for (const [roll2, rollf2] of rolls) {
                            const gg = g.Copy(),
                                f = freq * rollf1 * rollf2

                            if (gg.Move(2, roll2)) wins[1] += f
                            else newList.IncrementOrCreate(gg.toString(), f)
                        }
                    }

                    
                }
            })

            list = newList.Log()
        }

        wins.Log()
    }
    static Day22() {
        const onCubes = new Set<string>()

        for (const l of Data) {
            l.Log()
            const [instr, p] = l.split(' ')
            let pos = p.split(',').map(c => c.slice(2).split('..').toIntArray())
            const min = XYZ.fromTuple(pos.map(a => a[0] < -50 ? -50 : a[0]) as [number, number, number]),
                max = XYZ.fromTuple(pos.map(a => a[1] > 50 ? 50 : a[1]) as [number, number, number])
            
            if (min.toArray().some((v, i) => v > max.toArray()[i])) continue

            max.foreachCombination(xyz => {
                if (xyz.IsGreaterEQAll(new XYZ(-50)) && xyz.IsLessEQAll(new XYZ(50))) {
                    if (instr === 'on') {
                        onCubes.add(xyz.toString())
                    } else {
                        onCubes.delete(xyz.toString())
                    }
                }
            }, min)

        }

        onCubes.size.Log()
    }
    static Day22_2() {
        class Cuboid {
            constructor(public MinX: number,
                        public MaxX: number,
                        public MinY: number,
                        public MaxY: number,
                        public MinZ: number,
                        public MaxZ: number,
                        public Vol0?: boolean) {}

            Intersect(c: Cuboid) {
                let cc = new Cuboid(
                    [this.MinX, c.MinX].Max(),
                    [this.MaxX, c.MaxX].Min(),
                    
                    [this.MinY, c.MinY].Max(),
                    [this.MaxY, c.MaxY].Min(),

                    [this.MinZ, c.MinZ].Max(),
                    [this.MaxZ, c.MaxZ].Min(),
                )
                if (cc.MaxX < cc.MinX || cc.MaxY < cc.MinY || cc.MaxZ < cc.MinZ) return new Cuboid(0, 0, 0, 0, 0, 0, true)
                return cc
            }

            Volume(): number {
                if (this.Vol0) return 0
                return (this.MaxX - this.MinX + 1) *
                       (this.MaxY - this.MinY + 1) *
                       (this.MaxZ - this.MinZ + 1)
            }
        }
        class Instruction {
            Cuboid: Cuboid
            On: boolean

            constructor(instr: string) {
                const [type, range] = instr.split(' ')
                this.On = type === 'on'
                const pos = range.split(',').flatMap(c => c.slice(2).split('..').toIntArray()) as [number, number, number, number, number, number,]

                this.Cuboid = new Cuboid(...pos)
            }
        }

        function HowManyOn(insts: Instruction[], cuboid: Cuboid): number {
            const instr = insts.at(-1)!
            if (insts.length === 1) {
                if (!instr.On) return 0
                else return instr.Cuboid.Intersect(cuboid).Volume()
            }
            const allOn = HowManyOn(insts.slice(0, -1), cuboid),
                intersection = cuboid.Intersect(instr.Cuboid)
            if (intersection.Volume() === 0) return allOn
            const on = HowManyOn(insts.slice(0, -1), intersection)

            return allOn - on + (instr.On ? intersection.Volume() : 0)
        }
        //define reactor cuboid as instruction min/maxes

        const is = Data.map(l => new Instruction(l))

        const reactorCuboid = is.map(i => i.Cuboid).reduce((c, cc) => {
            return new Cuboid(
                [c.MinX, cc.MinX].Min(),
                [c.MaxX, cc.MaxX].Max(),
                                    
                [c.MinY, cc.MinY].Min(),
                [c.MaxY, cc.MaxY].Max(),

                [c.MinZ, cc.MinZ].Min(),
                [c.MaxZ, cc.MaxZ].Max())
        })

        reactorCuboid.Log()

        // for (let i = 1; i <= is.length; i++) {
            console.log(420, HowManyOn(is, reactorCuboid))
        // }

        //allOn == 494804
        //on == 2256
        //intvol == 2992


    }
    static Day23() {
        class Tile {
            constructor(public Home?: string, public Occupant?: string, public AtDest = false) {}

            get Weight() {
                switch (this.Occupant) {
                    case 'A': return 1
                    case 'B': return 10
                    case 'C': return 100
                    case 'D': return 1000
                }
                throw new Error('unknown occupant ')
            }

            Copy() { return new Tile(this.Home, this.Occupant, this.AtDest)}
        }
        class Board {
            Tiles: Tile[]
            NextMoves: Board[] = []
            Parent?: Board
            constructor(tiles: Tile[], public Weight: number, parent?: Board) {
                this.Tiles = tiles
                this.Parent = parent
            }

            FindNextMoves(): void {
                for (let from = 0; from < this.Tiles.length; from++) {
                    if (this.Tiles[from].Occupant) {
                        for (let to = 0; to < this.Tiles.length; to++) {
                            if (from === to) continue

                            if (!this.IsValidMove(from, to)) continue
                            const path = this.FindPath(from, to)
                            if (this.IsObstructed(path)) continue

                            const b = new Board(this.Tiles.map(t => t.Copy()),
                                this.Weight + path.length * this.Tiles[from].Weight,
                                this)
                            b.Tiles[to].Occupant = b.Tiles[from].Occupant
                            b.Tiles[from].Occupant = undefined
                            if (this.rooms[to]) {
                                b.Tiles[to].AtDest = true
                                this.NextMoves = []
                            }
                            this.NextMoves.push(b)
                        }
                    }
                }
            }

            private connections: {[node: number]: number[]} = {
                0: [1],
                1: [0, 2],
                2: [1, 3, 11],
                3: [2, 4],
                4: [3, 5, 15],
                5: [4, 6],
                6: [5, 7, 19],
                7: [6, 8],
                8: [7, 9, 23],
                9:  [8, 10],
                10: [9],

                11: [2, 12],
                12: [11, 13],
                13: [12, 14],
                14: [13],

                15: [4, 16],
                16: [15, 17],
                17: [16, 18],
                18: [17],

                19: [6, 20],
                20: [19, 21],
                21: [20, 22],
                22: [21],

                23: [8, 24],
                24: [23, 25],
                25: [24, 26],
                26: [25],
            }
            private rooms: {[node: number]: number[]} = {
                    11: [11, 12, 13, 14],
                    12: [11, 12, 13, 14],
                    13: [11, 12, 13, 14],
                    14: [11, 12, 13, 14],

                    15: [15, 16, 17, 18],
                    16: [15, 16, 17, 18],
                    17: [15, 16, 17, 18],
                    18: [15, 16, 17, 18],

                    19: [19, 20, 21, 22],
                    20: [19, 20, 21, 22],
                    21: [19, 20, 21, 22],
                    22: [19, 20, 21, 22],

                    23: [23, 24, 25, 26],
                    24: [23, 24, 25, 26],
                    25: [23, 24, 25, 26],
                    26: [23, 24, 25, 26],
            }

            FindPath(from: number, to: number): number[] {
                const connections = this.connections
                function findPath(path: number[]): number[] | null {
                    if (path.at(-1)! === to) return path
                    for (const adjacent of connections[path.at(-1)!]) {
                        if (!path.includes(adjacent)) {
                            const p = findPath(path.concat(adjacent))
                            if (p !== null) return p
                        }
                    }
                    return null
                }
                const p = findPath([from])?.slice(1)

                if (!p) throw new Error(`could not find path (${from} => ${to})`)

                return p
            }

            IsValidMove(from: number, to: number): boolean {
                if (from === to) return false
                if (from < 0 || from >= this.Tiles.length || to < 0 || to >= this.Tiles.length) throw new Error('Bad move') // invalid parameters
                if (this.Tiles[to].Occupant) return false // destination occupied
                if (this.Tiles[from].AtDest) return false
                if (!this.Tiles[from].Occupant) return false // nobody to move
                if ([2, 4, 6, 8].includes(to)) return false // rule 1

                const room = this.rooms[to]
                if (room) {
                    //going into room
                    if (this.Tiles[to].Home !== this.Tiles[from].Occupant ||
                        room.map(t => this.Tiles[t]).some(t => t.Occupant && t.Occupant !== t.Home)) return false // rule 2
                    else {
                        //home room && right people

                        //ensure deepest in room
                        if (!this.Tiles[room[1]].Occupant && to === room[0]) return false
                    }
                }

                if (from <= 10 && !room) return false // rule 3
                return true
            }

            IsObstructed(path: number[]) {
                return path.some(tile => this.Tiles[tile].Occupant)
            }

            Log() {
                const t = (i: number) => this.Tiles[i].Occupant ?? '.'
                console.log(`#############`)
                console.log(`#${this.Tiles.filter((t, i) => i <= 10).map(t => t.Occupant ?? '.').join('')}#`)
                console.log(`###${t(11)}#${t(15)}#${t(19)}#${t(23)}###`)
                console.log(`  #${t(12)}#${t(16)}#${t(20)}#${t(24)}#  `)
                console.log(`  #${t(13)}#${t(17)}#${t(21)}#${t(25)}#  `)
                console.log(`  #${t(14)}#${t(18)}#${t(22)}#${t(26)}#  `)
                console.log(`  #########  `)
                console.log(``)
            }

            LogSteps() {
                if (this.Parent) this.Parent.LogSteps()
                this.Log()
            }

            Hash() {
                return `${this.Tiles.map(t => t.Occupant ?? '.').join('')}:${this.Weight}`
            }
        }

        // const headBoard = new Board(
        //     [new Tile, new Tile, new Tile, new Tile, new Tile, new Tile, new Tile, new Tile, new Tile, new Tile, new Tile,
        //         new Tile('A', 'B'), new Tile('A', 'D'), new Tile('A', 'D'), new Tile('A', 'A', true),
        //         new Tile('B', 'C'), new Tile('B', 'C'), new Tile('B', 'B'), new Tile('B', 'D'),
        //         new Tile('C', 'B'), new Tile('C', 'B'), new Tile('C', 'A'), new Tile('C', 'C', true),
        //         new Tile('D', 'D'), new Tile('D', 'A'), new Tile('D', 'C'), new Tile('D', 'A'),
        //     ], 0)

        const headBoard = new Board(
            [new Tile, new Tile, new Tile, new Tile, new Tile, new Tile, new Tile, new Tile, new Tile, new Tile, new Tile,
                new Tile('A', 'C'), new Tile('A', 'D'), new Tile('A', 'D'), new Tile('A', 'B'),
                new Tile('B', 'A'), new Tile('B', 'C'), new Tile('B', 'B'), new Tile('B', 'A'),
                new Tile('C', 'B'), new Tile('C', 'B'), new Tile('C', 'A'), new Tile('C', 'D'),
                new Tile('D', 'D'), new Tile('D', 'A'), new Tile('D', 'C'), new Tile('D', 'C'),
            ], 0)

        // const headBoard = new Board(
        //     [new Tile(undefined, 'A'), new Tile(undefined, 'A'), new Tile, new Tile, new Tile, new Tile, new Tile, new Tile(undefined, 'B'), new Tile, new Tile(undefined, 'B'), new Tile(undefined, 'D'),
        //         new Tile('A', 'B'), new Tile('A', 'D'), new Tile('A', 'D'), new Tile('A', 'A', true),
        //         new Tile('B', 'C'), new Tile('B', 'C'), new Tile('B', 'B'), new Tile('B', 'D'),
        //         new Tile('C'), new Tile('C'), new Tile('C'), new Tile('C', 'C', true),
        //         new Tile('D'), new Tile('D'), new Tile('D', 'C'), new Tile('D', 'A'),
        //     ], 0)

        const searched = new Set<string>()

        let leastWeight = Number.MAX_VALUE

        const recurse = (b: Board) => {
            // b.Log()
            b.FindNextMoves()
            for (const board of b.NextMoves) {
                const hash = board.Hash()
                if (searched.has(hash)) continue

                searched.add(hash)
                if (board.Tiles.every(tile => !tile.Occupant || tile.AtDest)) {
                    //completion
                    if (board.Weight < leastWeight) {
                        board.LogSteps()
                        leastWeight = board.Weight.Log()
                    }
                }
                else {
                    if (board.Weight < leastWeight)
                        recurse(board)
                }
                
            }
        }
        recurse(headBoard)
        
        leastWeight.Log()
    }
    static Day24() {
        class Step {
            constructor(
                public A: number,
                public B: number,
                public C: number) {}
        }

        const steps = [
            new Step(1, 10, 5),
            new Step(1, 13, 9),
            new Step(1, 12, 4),
            new Step(26, -12, 4),
            new Step(1, 11, 10),
            new Step(26, -13, 14),
            new Step(26, -9, 14),
            new Step(26, -12, 12),
            new Step(1, 14, 14),
            new Step(26, -9, 14),
            new Step(1, 15, 5),
            new Step(1, 11, 10),
            new Step(26, -16, 8),
            new Step(26, -2, 15),
        ]

        function Emu1(w: number, A: number, B: number, C: number) {
            let x = 0, y = 0, z = 0

            x = z
            x %= 26
            z /= A
            console.log(`z /= ${A}`)
            x += B
            x = x === w ? 1 : 0
            x = x === 0 ? 1 : 0
            y += 25
            y *= x
            y += 1
            z *= y
            console.log(`z *= ${y}`)
            y = w
            y += C
            y *= x
            z += y
            console.log(`z += ${y}`)
        }

        function Emu2(input: number[]) {
            const stack = new Stack<number>();
            for (const [step, w] of steps.map((s, i) => [s, input[i]] as [Step, number])) {

                let x = (step.A === 26 ? stack.Pop() : stack.Peek()) ?? 0

                if (x + step.B != w)
                    stack.Push(w + step.C)

                stack.Log()
            }
            stack.Array.join('').Log()
            return stack.Count === 0
        }

        function Emu3(input: number[]) {
            console.log('Evaluating', input)
            let reg: {[key: string]: number} = {
                w: 0,
                x: 0,
                y: 0,
                z: 0
            }
            let inputIndex = 0
            console.log('             w  x  y  z')
            for (const line of Data) {
                const l = line.split(' ')
                const [instruction, v1, v2] = l
                let a = reg[v1]!
                let b = reg[v2] ?? v2?.toInt()
                switch (instruction) {
                    case 'inp':
                        console.log(reg.z)
                        reg[v1] = input[inputIndex]
                        inputIndex++
                        break
                    case 'add':
                        reg[v1] += b
                        break
                    case 'mul':
                        reg[v1] *= b
                        break
                    case 'div':
                        reg[v1] = Math.floor(a / b)
                        break
                    case 'mod':
                        reg[v1] %= b
                        break
                    case 'eql':
                        reg[v1] = a === b ? 1 : 0
                        break
                    case 'log':
                        console.log(a, v2 ?? '')
                        break
                    case 'ret':
                        return a
                }
                console.log(line.padEnd(9), '=>', reg.Values().map(r => r.toString().padStart(2)).join('|'))
            }
        }

        const memo = new BigMap<string, number[][] | null>()

        function nextZ(step: number, w: number, z: number): number {
            const s = steps[step]
            let x = z % 26 + s.B === w ? 0 : 1
            return (Math.floor(z / s.A) * (25 * x + 1)) + ((w + s.C) * x)
        }

        function AllValidSuffix(step: number, z: number): number[][] | null {
            if (step === 14) return z === 0 ? [] : null
            // const memoKey = step+','+z
            // let found = memo.get(memoKey)
            let result = null
            for (let w = 1; w <= 9; w++) {
                let nZ = nextZ(step, w, z)
                const memoKey = (step + 1) + ',' + nZ
                let allValid = memo.get(memoKey)
                if (allValid === undefined) {
                    allValid = AllValidSuffix(step + 1, nZ)
                    memo.set(memoKey, allValid)
                }
                
                if (allValid === null) continue
                if (allValid.length === 0) return [[w]]
                result ??= []
                for (const valid of allValid) result.push([w].concat(valid))
            }
            return result
        }

        const answers = AllValidSuffix(0, 0)

        if (answers) {
            const s = answers.map(a => a.join('').toInt())
            console.log(`Found ${s.length} valid. Min: ${s.Min()}, Max: ${s.Max()}`)
        }
        else {
            console.log('Found no valids')
        }
    }
    static Day25() {
        let d = Array2D.fromArray(Data.map(l => l.toArray().map(t => t === '.' ? undefined : t)))

        function HalfStep(d: Array2D<string | undefined>, offset: XY, char: string) {

            const newD = new Array2D<string>(d.Size)
            d.forEach((t, xy) => {
                if (!t) return
                const newXY = xy.plus(offset).mod(d.Size)
                newD.set(t === char || d.get(newXY) ? xy : newXY, t)
            })
            return newD
        }

        for (let i = 0; ; i++) {
            let again = false
            i.Log()
            // d.Log()
            let newD = HalfStep(HalfStep(d, new XY(1, 0), 'v'), new XY(0, 1), '>')
            if (newD.some((t, xy) => t !== d.get(xy))) again = true
            d = newD
            
            if (again) continue

            (i + 1).Log()
            break
        }
        d.Log()
        
    }
}
