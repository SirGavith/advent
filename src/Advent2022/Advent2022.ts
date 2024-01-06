const UseExample = false
import { Stack } from '../Glib/Stack'
import { Array2D, XY } from '../Glib/XY'
import { Filer } from '../Glib/Filer'
import { Sorts } from '../Glib/Sort'
import * as GArray from '../Glib/Array'
import * as Console from '../Glib/Console'
import { BigSet } from '../Glib/BigSet'
import { XYZ } from '../Glib/XYZ'
import { n1, n2, n3, n4, n5, n6, n7, n8, n9 } from '../Glib/Array'
import { BiLinkedList, BiLinkedNode } from '../Glib/LinkedList'
import { Cx } from '../Glib/Complex'

const Data = Filer.ReadAllLines(UseExample ? './data/example.txt' : './data/input.txt'),
    DataFull = Filer.ReadFile(UseExample ? './data/example.txt' : './data/input.txt')

export function Day25() {
    const val = (snafu: string[]) => 
        snafu.map((char, i, arr) => {
            const placeValue = 5 ** (arr.length - i - 1)
            const digitVal = char === '2' ? 2 :
                            char === '1' ? 1 :
                            char === '0' ? 0 :
                            char === '-' ? -1 :
                            char === '=' ? -2 : undefined
            if (digitVal === undefined) throw new Error
            return placeValue * digitVal
        }).Sum()
    

    const decimal = Data.map(e => val(e.toArray())).Sum().Log()

    //start with a number too big, all 2s
    let outLen = (Math.log2(decimal) / Math.log2(5)).Ceil().Log()
    let out = GArray.Range(0, outLen).map(_ => '2')
    if (val(out) < decimal) {
        out.push('2')
        outLen++
    }
    let outVal = val(out)


    for(let i = 0; i < outLen; i++) {
        if (val(out) < decimal) throw new Error ('bad')

        out.Log()
        const p = out.Copy()
        while(true) {
            //try decrimenting char
            if (p[i] === '=') break

            p[i] = p[i] === '2' ? '1' :
                   p[i] === '1' ? '0' :
                   p[i] === '0' ? '-' :
                        '='

            const pVal = val(p)

            if (pVal >= decimal) {
                out = p.Copy()
                outVal = pVal
                if (decimal === outVal) {
                    break
                }
            }
            else {
                //less, wrong
                break
            }
        }
        if (decimal === outVal) break
    }

    out.Log()
    outVal.Log()

    out.join('').Log()
}

export function Day24() {
    const size = new XY(Data[0].length, Data.length).minus(2)
    const dest = size.minus(1)
    //get to bottom right, always just add one
    //go for dijkstras bfs
    
    const blizzards: Array<[XY, XY]>[] = [[]] //direction, pos

    Data.slice(1, -1).forEach((l, y) => {
        l.slice(1, -1).forEach((c, x) => {
            let dir: XY | undefined = undefined
            if      (c === 'v') dir = XY.Up
            else if (c === '>') dir = XY.Right
            else if (c === '^') dir = XY.Down
            else if (c === '<') dir = XY.Left
            else return
            blizzards[0].push([dir, new XY(x, y)])
        })
    })

    const genBlizzards = () => {
        blizzards.push(blizzards.at(-1)!.map(([dir, pos]) => {
            let nPos = pos.plus(dir).plus(size).mod(size)
            return [dir, nPos]
        }))
    }

    const pathTo = (from: XY, to: XY, startTime: number) => {
        const times: Array2D<number>[] = [new Array2D(size, 99999)] //indexed by time
        const prevs: Array2D<XY>[] = [new Array2D(size)] //indexed by time

        const Q: [XY, number][] = [[from, startTime]] // pos, time

        const visited = new Set<string>()

        for (let i = 0; Q.length > 0; i++) {
            const [pos, time] = Q.shift()!

            const key = pos.toString() + ' ' + time.toString()
            if (visited.has(key)) continue
            visited.add(key)

            if (pos.EQ(to)) {
                //done
                return time - startTime
            }

            if (times[time + 1] === undefined) {
                times[time + 1] = new Array2D<number>(size, 99999)
                prevs[time + 1] = new Array2D(size)
            }

            if (blizzards[time + 1] === undefined) genBlizzards()
            const nblizzards = blizzards[time + 1]

            //consider staying if there isnt a blizzard
            if (nblizzards.find(b => b[1].EQ(pos)) === undefined) {
                if (time + 1 < times[time + 1].get(pos)!) {
                    times[time + 1].set(pos, time + 1)
                    prevs[time + 1].set(pos, pos)
                }
                Q.push([pos, time + 1])
            }

            pos.Neighbours().forEach(adj => {
                if (adj.IsGreaterEQBoth(XY.Zero) &&
                        adj.IsLessBoth(size) &&
                        nblizzards.find(b => b[1].EQ(adj)) === undefined) {

                    if (time + 1 < times[time + 1].get(adj)!) {
                        times[time + 1].set(adj, time + 1)
                        prevs[time + 1].set(adj, pos)
                    }
                    Q.push([adj, time + 1])
                }
            })
        }
        throw new Error()
    }
    let t = 0
    t += pathTo(new XY(0, -1), dest, t)
    t++
    t.Log()
    genBlizzards()
    t += pathTo(dest.plus(0, 1), XY.Zero, t)
    t++
    t.Log()
    genBlizzards()
    t += pathTo(new XY(0, -1), dest, t)
    t++
    t.Log()

    // const path: XY[] = []

    // const rec = (pos: XY, tt: number) => {
    //     path.unshift(pos)
    //     const p = prevs[tt].get(pos)
    //     if (p !== undefined) rec(p, tt - 1)
    // }

    // rec(dest, t)


    // for (let i = 0; i <= t; i++) {
    //     const a = new Array2D(size).map((_, xy) => {
    //         const bCount = blizzards[i].Count(b => b[1].EQ(xy))
    //         if (bCount > 1) return bCount.toString()
    //         if (bCount > 0) {
    //             const b = blizzards[i][blizzards[i].findIndex(b => b[1].EQ(xy))]
    //             if (b[0] === XY.Up) return 'v'
    //             if (b[0] === XY.Right) return '>'
    //             if (b[0] === XY.Left) return '<'
    //             if (b[0] === XY.Down) return '^'
    //         }
    //         return '.'
    //     })
    //     // if (i > 0) a.set(path[i], 'E')

    //     a.Log()
    // }

    // console.log(t + 1)


}

export function Day23() {
    const dataSize = new XY(Data[0].length, Data[1].length)
    const arr = new Array2D(dataSize.times(3), false, true)
    Array2D.fromArray(Data.map(l => l.toArray().map(c => c === '.' ? false : true))).forEach((v, xy) => arr.set(xy.plus(dataSize), v))
    arr.Log()

    const options = [
        [new XY(-1,-1), new XY(0,  -1), new XY(1,-1)], // north
        [new XY(-1, 1), new XY(0,  1), new XY(1,  1)], // south
        [new XY(-1,-1), new XY(-1, 0), new XY(-1, 1)], // west
        [new XY(1, -1), new XY(1,  0), new XY(1,  1)], // east
    ]

    for (let round = 1; ; round++) {
        const elves: [XY, XY][] = [] //elf, proposedPos

        arr.Entries().filter(([_, v]) => v === true).forEach(([elf]) => {
            if (elf.Neighbours(true).find(nxy => arr.get(nxy) === true) === undefined) return
            options.ForEach(o => {
                if (o.map(xy => xy.plus(elf)).find(nxy => arr.get(nxy) === true) === undefined) {
                    //can move in dir
                    elves.push([elf, elf.plus(o[1])])
                    return true
                }
            })
        })

        const hits = elves.map(e => e[1].toString()).Duplicates().map(d => XY.fromString(d))
        
        elves.forEach(([from, to]) => {
            if (hits.find(e => e.EQ(to)) === undefined) {
                arr.set(from, false)
                arr.set(to, true)
            }
        })

        if (elves.length === 0) {
            arr.Log()
            console.log('no elves moved on round', round)
            break
        }

        if (round % 100 === 0) {
            console.log(round)
            arr.Log()
        }

        options.push(options.shift()!)
    }

    const min = arr.Size.div(2)
    const max = arr.Size.div(2)

    const elves = arr.Entries().filter(([_, v]) => v === true)
    elves.forEach(([elf]) => {
        if (elf.X < min.X) min.X = elf.X
        if (elf.Y < min.Y) min.Y = elf.Y
        if (elf.X > max.X) max.X = elf.X
        if (elf.Y > max.Y) max.Y = elf.Y
    })

    console.log(max.minus(min).plus(1).Area - elves.length)

}

export function Day22() {
    //all inclusive
    const edgeSize = UseExample ? 4 : 50

    const A = new XY
    const B = new XY(edgeSize - 1, 0)
    const C = new XY(0, edgeSize - 1)
    const D = new XY(edgeSize - 1, edgeSize - 1)

    const edges: {[key: string]: {
        '0'?: [XY, XY],
        '1'?: [XY, XY],
        '2'?: [XY, XY],
        '3'?: [XY, XY],
        '4'?: [XY, XY],
        '5'?: [XY, XY],
        'dir': {
            '1'?: Cx,
            '-1'?: Cx,
            'i'?: Cx,
            '-i'?: Cx,
        }
    }} = UseExample ? {
        '01': {
            //between 1 and two
            '0': [A, B],
            '1': [B, A],
            //up => down
            'dir': {
                'i': new Cx(0, -1),
            }
        },
        '02': {
            //between 1 and two
            '0': [A, C],
            '2': [A, B],
            //left => down
            //up => right
            'dir': {
                '-1': new Cx(0, -1) ,
                'i': new Cx(1, 0),
            }
        },
        '03': {
            '0': [C, D],
            '3': [A, B],
            //down => down
            //up => up
            'dir': {
                'i': new Cx(0, 1),
                '-i': new Cx(0, -1),
            }
        },
        '05': {
            //between 1 and two
            '0': [B, D],
            '5': [D, B],
            //right => left
            'dir': {
                '1': new Cx(-1, 0),
            }
        },
        '12': {
            '1': [B, D],
            '2': [A, C],
            //left => left
            //right => right
            'dir': {
                '-1': new Cx(-1),
                '1': new Cx(1),
            }
        },
        '14': {
            //between 1 and two
            '1': [C, D],
            '4': [D, C],
            //down => up
            'dir': {
                '-i': new Cx(0, 1),
            }
        },
        '15': {
            //between 1 and two
            '1': [A, C],
            '5': [D, C],
            //down => right
            //left => up
            'dir': {
                '-i': new Cx(1, 0),
                '-1': new Cx(0, 1),
            }
        },
        '23': {
            '2': [B, D],
            '3': [A, C],
            //left => left
            //right => right
            'dir': {
                '-1': new Cx(-1),
                '1': new Cx(1),
            }
        },
        '24': {
            //between 1 and two
            '2': [C, D],
            '4': [C, A],
            //down => right
            //left => up
            'dir': {
                '-i': new Cx(1, 0),
                '-1': new Cx(0, 1),
            }
        },
        '34': {
            '3': [C, D],
            '4': [A, B],
            //down => down
            //up => up
            'dir': {
                'i': new Cx(0, 1),
                '-i': new Cx(0, -1),
            }
        },
        '35': {
            //between 1 and two
            '3': [B, D],
            '5': [B, A],
            //right => down
            //up => left
            'dir': {
                '1': new Cx(0, -1),
                'i': new Cx(-1, 0),
            }
        },
        '45': {
            '4': [B, D],
            '5': [A, C],
            //left => left
            //right => right
            'dir': {
                '-1': new Cx(-1),
                '1': new Cx(1),
            }
        },
    } : {
        '01': {
            '0': [A, B],
            '1': [A, C],
            'dir': {
                'i': new Cx(1, 0),
                '-1': new Cx(0, -1),
            }
        },
        '02': {
            '0': [A,C],
            '2': [C,A],
            'dir': {
                '-1': new Cx(1),
            }
        },
        '03': {
            '0': [C,D],
            '3': [A,B],
            //down => down
            //up => up
            'dir': {
                'i': new Cx(0, 1),
                '-i': new Cx(0, -1),
            }
        },
        '05': {
            '0': [B,D],
            '5': [A,C],
            'dir': {
                '1': new Cx(1, 0),
                '-1': new Cx(-1, 0),
            }
        },
        '12': {
            '1': [A,B],
            '2': [C,D],
            'dir': {
                'i': new Cx(0, 1),
                '-i': new Cx(0, -1),
            }
        },
        '14': {
            '1': [B, D],
            '4': [C, D],
            'dir': {
                '1': new Cx(0, 1),
                '-i': new Cx(-1),
            }
        },
        '15': {
            '1': [C, D],
            '5': [A, B],
            'dir': {
                'i': new Cx(0, 1),
                '-i': new Cx(0, -1),
            }
        },
        '23': {
            '2': [A, B],
            '3': [A, C],
            'dir': {
                'i': new Cx(1),
                '-1': new Cx(0, -1),
            }
        },
        '24': {
            '2': [B, D],
            '4': [A, C],
            'dir': {
                '1': new Cx(1, 0),
                '-1': new Cx(-1),
            }
        },
        '34': {
            '3': [C, D],
            '4': [A, B],
            //down => down
            //up => up
            'dir': {
                'i': new Cx(0, 1),
                '-i': new Cx(0, -1),
            }
        },
        '35': {
            '3': [B, D],
            '5': [C, D],
            'dir': {
                '1': new Cx(0, 1),
                '-i': new Cx(-1, 0),
            }
        },
        '45': {
            '4': [B, D],
            '5': [D, B],
            'dir': {
                '1': new Cx(-1),
            }
        },
    }

    const faceEdges = UseExample ? [
        {
            '1': 5,
            '-1': 2,
            'i': 1,
            '-i': 3,
        },
        {
            '1': 2,
            '-1': 5,
            'i': 0,
            '-i': 4,
        },
        {
            '1': 3,
            '-1': 1,
            'i': 0,
            '-i': 4,
        },
        {
            '1': 5,
            '-1': 2,
            'i': 0,
            '-i': 4,
        },
        {
            '1': 5,
            '-1': 2,
            'i': 3,
            '-i': 1,
        },
        {
            '1': 0,
            '-1': 4,
            'i': 3,
            '-i': 1,
        },
    ] : [
        {
            '1': 5,
            '-1': 2,
            'i': 1,
            '-i': 3,
        },
        {
            '1': 4,
            '-1': 0,
            'i': 2,
            '-i': 5,
        },
        {
            '1': 4,
            '-1': 0,
            'i': 3,
            '-i': 1,
        },
        {
            '1': 5,
            '-1': 2,
            'i': 0,
            '-i': 4,
        },
        {
            '1': 5,
            '-1': 2,
            'i': 3,
            '-i': 1,
        },
        {
            '1': 4,
            '-1': 0,
            'i': 1,
            '-i': 3,
        },
    ]

    //all lines begin at same pos, but end different lengths
    const instructions = Data.at(-1)!
    const lines = Data.slice(0, -2).map(l => 
        l.toArray().map(c => c === ' ' ? undefined : c === '.' ? false : true)
    )
    const arr = Array2D.fromArray(lines, new XY(lines.map(l => l.length).Max(), lines.length))

    const faceXYs = UseExample ? [
        new XY(8, 0),
        new XY(0, 4),
        new XY(4, 4),
        new XY(8, 4),
        new XY(8, 8),
        new XY(12, 8),
    ] : [
        new XY(50, 0),
        new XY(0, 150),
        new XY(0, 100),
        new XY(50, 50),
        new XY(50, 100),
        new XY(100, 0),
    ]

    const faces: Array2D<boolean>[] = faceXYs.map((xy0) => 
        new Array2D<boolean>(new XY(edgeSize)).map((_, xy) => arr.get(xy0.plus(xy)))
    )

    const path = faces.map(f => f.Copy() as Array2D<boolean | string>)

    let face = 0
    let pos = new XY
    let dir = new Cx(1, 0)
    let i = 0
    instructions.toNumsArray().forEach(n => {
        //travel up to that many times
        let dirXY = new XY(dir.Re, 0-dir.Im)

        for (let j = 0; j < n; j++) {

            path[face].set(pos, 'x')


            let nextPos = pos.plus(dirXY)
            let nextTile = faces[face].get(nextPos)

            if (nextTile === true) {
                break
            }
            else if (nextTile === false) {
                pos = nextPos
                continue
            }
            else if (nextTile === undefined) {
                //find number of next face
                const nextFace = faceEdges[face][dir.toString() as '1' | '-1' | 'i' | '-i']
                if (nextFace === undefined) throw new Error('cannot find next face')
                //find edge object of current edge
                const edge = edges[[face, nextFace].Sort(Sorts.LeastFirst).join('')]
                if (nextFace === undefined) throw new Error('cannot find edge')
                //find the mappings of the two halves of the edge
                const edgemap = edge[face.toString() as '0' | '1' | '2' | '3' | '4' | '5'],
                    nextEdgemap = edge[nextFace.toString() as '0' | '1' | '2' | '3' | '4' | '5']
                if (edgemap === undefined) throw new Error()
                if (nextEdgemap === undefined) throw new Error()

                //find out pos along current side of edge

                let edgeCombos: XY[] = edgemap[1].Combinations(edgemap[0])
                let nextEdgeCombos: XY[] = nextEdgemap[1].Combinations(nextEdgemap[0])
                let reversed = false

                //if current edge does left or up, reverse things
                if (edgeCombos.length === 0) {
                    edgeCombos = edgemap[0].Combinations(edgemap[1])
                    reversed = !reversed
                }
                if (nextEdgeCombos.length === 0) {
                    nextEdgeCombos = nextEdgemap[0].Combinations(nextEdgemap[1])
                    reversed = !reversed
                }

                let tileI
                edgeCombos.ForEach((xy, i) => {
                    if (xy.EQ(pos)) {
                        tileI = i
                        return true
                    }
                })
                if (tileI === undefined) throw new Error('tile not found in edge')

                //find out pos along next side of edge
                nextPos = nextEdgeCombos.at(reversed ? -1-tileI : tileI)!
                
                if (nextPos === undefined) throw new Error('cannot find next pos')

                //check if next position is blocked
                if (faces[nextFace].get(nextPos) === true) {
                    break
                }
                console.log(`face ${face}`)
                path[face].Log()
                console.log(`to face ${nextFace}`)
                console.log()


                //set things
                face = nextFace
                pos = nextPos
                const nextDir = edge['dir'][dir.toString() as keyof typeof edge.dir]
                if (nextDir === undefined) throw new Error('cannot find next direction')
                dir = nextDir
                dirXY = new XY(dir.Re, 0 - dir.Im)
            }
        }

        path[face].set(pos, 'X')

        i += n.toString().length + 1
        dir = (instructions.charAt(i - 1) === 'R' ? Cx.Ni : Cx.i).times(dir)

    })
    dir = dir.times(Cx.Ni)

    console.log(`face ${face}`)
    path[face].Log()
    console.log(`done`)
    console.log()

    pos.Log()
    pos.plusEQ(faceXYs[face])
    pos.Log()
    dir.Log()

    const d = dir.Im === 0 ? 
        (dir.Re === 1 ? 0 : 2) :
        dir.Im === -1 ? 1 : 3
    console.log(1000 * (pos.Y + 1) + 4 * (pos.X + 1) + d)
}

export function Day21() {
    class OpMonkey {
        Name: string
        Operator: '+' | '-' | '*' | '/'
        Operation:  ((a: number, b: number) => number)
        LiteralOperands: [string, string]
        Operands: [OpMonkey | number, OpMonkey | number] | undefined = undefined
        HumanLeft: boolean | undefined = undefined

        constructor(name: string, s: string[]) {
            this.Name = name
            this.LiteralOperands = [s[1], s[3]]
            this.Operator = s[2] as typeof this.Operator
            this.Operation =
                s[2] === '*' ? (a, b) => a * b :
                s[2] === '+' ? (a, b) => a + b :
                s[2] === '-' ? (a, b) => a - b :
                        /* '/' */(a, b) => (a / b).RoundFloating()
        }
    }

    let root: OpMonkey

    {
        const opMonkeyList: OpMonkey[] = []
        const opMonkeys: { [name: string]: OpMonkey } = {}
        const yellMonkeys: {[name: string]: number} = {}

        Data.forEach(l => {
            const s = l.split(' ')
            const name = s[0].slice(0, -1)
            if (s.length === 2) {
                yellMonkeys[name] = s[1].toInt()
            }
            else {
                const monkey = new OpMonkey(name, s)
                opMonkeyList.push(monkey)
                opMonkeys[name] = monkey

            }
        })

        for (let i = 0; i < opMonkeyList.length; i++) {
            const monkey = opMonkeyList[i],
                [l0, l1] = monkey.LiteralOperands
            monkey.Operands = [
                (l0 in opMonkeys) ? opMonkeys[l0] : yellMonkeys[l0],
                (l1 in opMonkeys) ? opMonkeys[l1] : yellMonkeys[l1],
            ]
        }

        root = opMonkeys['root']
    }


    function humanLeft(monkey: OpMonkey): boolean | undefined {
        if (monkey.LiteralOperands[0] === 'humn') {
            monkey.HumanLeft = true
            return true
        }
        if (monkey.LiteralOperands[1] === 'humn') {
            monkey.HumanLeft = false
            return false
        }

        if (typeof monkey.Operands![0] !== 'number') {
            const leftOfLeft = humanLeft(monkey.Operands![0])
            if (leftOfLeft !== undefined) {
                monkey.HumanLeft = true
                return true
            }
        }
        if (typeof monkey.Operands![1] !== 'number') {
            const leftOfRight = humanLeft(monkey.Operands![1])
            if (leftOfRight !== undefined) {
                monkey.HumanLeft = false
                return false
            }
        }
        monkey.HumanLeft = undefined
        return undefined
    }
    
    function result(monkey: OpMonkey): number {
        if (!monkey.Operands) throw new Error

        const [o0, o1] = monkey.Operands
        let [a, b] = [0, 0]

        if (typeof o0 === 'number') a = o0
        else a = result(o0)
    
        if (typeof o1 === 'number') b = o1
        else b = result(o1)

        return monkey.Operation(a, b)
    }

    function solve(monkey: OpMonkey | number, mustEQ: number | null): number {
        if (typeof monkey === 'number') {
            //found human
            if (mustEQ === null) throw new Error('human child of root')
            return mustEQ
        }

        if (monkey.HumanLeft === undefined) throw new Error()
        if (monkey.Operands === undefined) throw new Error()

        //one child always defined, the other always not

        const left = monkey.Operands[0]
        const right = monkey.Operands[1]

        if (monkey.HumanLeft === true) {
            //calculate right
            const resRight = typeof right === 'number' ? right : result(right)

            if (monkey === root) {
                if (mustEQ !== null) throw new Error()
                //left must equal resRight
                return solve(left, resRight)
            }
            else {
                if (mustEQ === null) throw new Error()

                if (monkey.Operator === '+') {
                    // left + resRight === mustEQ
                    // left === mustEQ - resRight
                    return solve(left, mustEQ - resRight)
                }
                else if (monkey.Operator === '-') {
                    // left - resRight === mustEQ
                    // left === mustEQ + resRight
                    return solve(left, mustEQ + resRight)
                }
                else if (monkey.Operator === '*') {
                    // left * resRight === mustEQ
                    // left === mustEQ / resRight
                    return solve(left, mustEQ / resRight)
                }
                else if (monkey.Operator === '/') {
                    // left / resRight === mustEQ
                    // left === mustEQ * resRight
                    return solve(left, mustEQ * resRight)
                }
            }
        }
        else {
            //human is on the right

            //calculate left
            const resLeft = typeof left === 'number' ? left : result(left)
            
            if (monkey === root) {
                if (mustEQ !== null) throw new Error()
                //right must equal resLeft
                return solve(right, resLeft)
            }
            else {
                if (mustEQ === null) throw new Error()

                if (monkey.Operator === '+') {
                    // resLeft + right === mustEQ
                    // right === mustEQ - resLeft
                    return solve(right, mustEQ - resLeft)
                }
                else if (monkey.Operator === '-') {
                    // resLeft - right === mustEQ
                    // right === resLeft - mustEQ 
                    return solve(right, resLeft - mustEQ)
                }
                else if (monkey.Operator === '*') {
                    // resLeft * right === mustEQ
                    // right === mustEQ / resLeft
                    return solve(right, mustEQ / resLeft)
                }
                else if (monkey.Operator === '/') {
                    // resLeft / right === mustEQ
                    // resLeft / mustEQ === right
                    return solve(right, resLeft / mustEQ)
                }
            }

        }

        throw new Error('shouldnt get here')

    }

    humanLeft(root) 

    solve(root, null).Log()
}

export function Day20() {
    const file = Data.toIntArray().map((val, i) => [val, i] as n2)

    file.map(v => v[0]).Log()


    for (let i = 0; i < file.length; i++) {
        const fromPos = file.findIndex(v => v[1] === i)
        const val = file[fromPos][0]

        if (val > 0) {
            let toPos = (fromPos + val) % file.length

            if (fromPos < toPos) {
                file.splice(toPos + 1, 0, [val, i])
                file.splice(fromPos, 1)

            }
            else {
                file.splice(toPos + 1, 0, [val, i])
                file.splice(fromPos + 1, 1)
            }
        }
        else if (val < 0) {
            let toPos = (fromPos + val - 1 + 100 * file.length) % file.length

            if (fromPos < toPos) {
                file.splice(toPos + 1, 0, [val, i])
                file.splice(fromPos, 1)

            }
            else {
                file.splice(toPos + 1, 0, [val, i])
                file.splice(fromPos + 1, 1)
            }
        }
    }


    const v0 = file.findIndex(v => v[0] === 0);

    [   file[(v0 + 1000) % file.length][0],
        file[(v0 + 2000) % file.length][0],
        file[(v0 + 3000) % file.length][0]].Sum().Log()


}
export function Day20_2() {
    //linked list time
    const file = new BiLinkedList<n2>()
    const count = Data.length
    Data.toIntArray().forEach((f, i) => {
        file.Push(new BiLinkedNode([f, i] as n2))
    })

    //circularify
    file.Final!.Next = file.Head
    file.Head!.Prev = file.Final

    for (let i = 0; i < count; i++) {
        let node!: BiLinkedNode<n2>;
        file.ForEach(val => {
            if (val.Value[1] === i) {
                node = val
                return true
            }
        }, count)
        if (node === undefined) throw new Error()
        const val = node.Value[0]

        if (val === 0) continue

        file.RemoveNode(node)

        let destPrecNode = node

        if (val > 0) {
            for (let offset = 0; offset < val; offset++) {
                destPrecNode = destPrecNode.Next!
            }
        }
        else if (val < 0) {
            for (let offset = 0; offset >= val; offset--) {
                destPrecNode = destPrecNode.Prev!
            }
        }

        node.Copy().InsertAfter(destPrecNode)

        // file.Log(count)
    }

    const arr = file.toArray(count).map(a => a[0])
    const v0 = arr.findIndex(v => v === 0);

    [arr[(v0 + 1000) % count],
     arr[(v0 + 2000) % count],
     arr[(v0 + 3000) % count]].Sum().Log()
}

export function Day20_3() {
    //linked list time
    const file = new BiLinkedList<n2>()
    const count = Data.length
    Data.toIntArray().forEach((f, i) => {
        file.Push(new BiLinkedNode([f, i] as n2))
    })

    //circularify
    file.Final!.Next = file.Head
    file.Head!.Prev = file.Final

    for (let i = 0; i < count; i++) {
        let node!: BiLinkedNode<n2>;
        file.ForEach(val => {
            if (val.Value[1] === i) {
                node = val
                return true
            }
        }, count)
        if (node === undefined) throw new Error()
        const val = node.Value[0]

        if (val === 0) continue


        if (val > 0) {
            for (let offset = 0; offset < val; offset++) {
                //swap values of node and node++
                let v = node.Value
                node.Value = node.Next!.Value
                node.Next!.Value = v

                node = node.Next!
            }
        }
        else if (val < 0) {
            for (let offset = 0; offset > val; offset--) {
                //swap values of node and node--
                let v = node.Value
                node.Value = node.Prev!.Value
                node.Prev!.Value = v

                node = node.Prev!
            }
        }

    }

    const arr = file.toArray(count).map(a => a[0])
    const v0 = arr.findIndex(v => v === 0);

    [arr[(v0 + 1000) % count],
    arr[(v0 + 2000) % count],
    arr[(v0 + 3000) % count]].Sum().Log()
}

export function Day20_4() {
    //linked list time
    const file = new BiLinkedList<n2>()
    const count = Data.length
    Data.toIntArray().forEach((f, i) => {
        file.Push(new BiLinkedNode([f * 811589153, i] as n2))
    })

    //circularify
    file.Final!.Next = file.Head
    file.Head!.Prev = file.Final

    for (let q = 0; q < 10; q++) {
        for (let i = 0; i < count; i++) {
            let node!: BiLinkedNode<n2>;
            file.ForEach(val => {
                if (val.Value[1] === i) {
                    node = val
                    return true
                }
            }, count)
            if (node === undefined) throw new Error()
            const val = node.Value[0]


            if (val === 0) continue
            let vv = Math.abs(val) < count ? val : ((val < 0 ? -1 : 1) * Math.abs(val) % (count - 1))
            if (vv === 0) continue


            file.RemoveNode(node)

            let destPrecNode = node

            if (vv > 0) {
                for (let offset = 0; offset < vv; offset++) {
                    destPrecNode = destPrecNode.Next!
                }
            }
            else if (vv < 0) {
                for (let offset = 0; offset >= vv; offset--) {
                    destPrecNode = destPrecNode.Prev!
                }
            }

            node.Copy().InsertAfter(destPrecNode)

            file.Log(count)
        }
    }

    const arr = file.toArray(count).map(a => a[0])
    const v0 = arr.findIndex(v => v === 0);

    [arr[(v0 + 1000) % count],
    arr[(v0 + 2000) % count],
    arr[(v0 + 3000) % count]].Sum().Log()
}

export function Day19() {
    const blueprints = Data.map(l => l.toNumsArray().slice(1) as n6)
        .map((costs) => [costs, 0, [costs[0], costs[1], costs[2], costs[4]].Max()] as [n6, number, number])
    /*  [ [orecost (ore), claycost (ore), obicost (ore), obicost (clay), geocost (ore), geocost (obi)],
            max so far;    max ore use per time ] */
    type blueprint = [n6, number, number]

    let memos: {[key: string]: number /* of geodes */} = {}

    function CopyInt16_4(arr: Int16Array): Int16Array {
        let a = new Int16Array(4)
        for (let i = 0; i < 4; i++)
            a[i] = arr[i]
        return a
    }
    function CopyInt8_4(arr: Int8Array): Int8Array {
        let a = new Int8Array(4)
        for (let i = 0; i < 4; i++)
            a[i] = arr[i]
        return a
    }

    function maxGeodes(bp: blueprint, timeLeft: number, res: Int16Array, robots: Int8Array): number {
        //base case (new)
        if (timeLeft === 1) return res[3] + robots[3]

        //too bad optimization
        const unrealisticMax = res[3] + robots[3] * timeLeft + (timeLeft * timeLeft - timeLeft) / 2
        if (unrealisticMax <= bp[1]) return 0

        //memoization
        const key = timeLeft + ' ' + res[0] + ' ' + res[1] + ' ' + res[2] + ' ' + res[3] + ' ' + robots[0] + ' ' + robots[1] + ' ' + robots[2] + ' ' + robots[3]
        if (key in memos) return memos[key]

        timeLeft--

        const maxToSpend = [bp[2] * timeLeft, bp[0][3] * timeLeft, bp[0][5] * timeLeft]
        const endRes = new Int16Array(4)

        for (let i = 0; i < 4; i++) {
            const r = res[i] + robots[i]
            //cut off surplus resources
            if (r > maxToSpend[i]) {
                endRes[i] = maxToSpend[i]
            }
            else endRes[i] = r
        }
        const options: number[] = []
        let optionCount = 0
        //make an ore robot
        if (res[0] >= bp[0][0] && robots[0] < bp[2]) {
            const r = CopyInt8_4(robots)
            r[0]++
            const re = CopyInt16_4(endRes)
            re[0] -= bp[0][0]
            options[0] = maxGeodes(bp, timeLeft, re, r)
            optionCount++
        }     
        //make an clay robot
        if (res[0] >= bp[0][1] && robots[1] < bp[0][3]) {
            const r = CopyInt8_4(robots)
            r[1]++
            const re = CopyInt16_4(endRes)
            re[0] -= bp[0][1]
            options[1] = maxGeodes(bp, timeLeft, re, r)
            optionCount++
        }
        //make an obi robot
        if (res[0] >= bp[0][2] && res[1] >= bp[0][3] && robots[2] < bp[0][5]) {
            const r = CopyInt8_4(robots)
            r[2]++
            const re = CopyInt16_4(endRes)
            re[0] -= bp[0][2]
            re[1] -= bp[0][3]
            options[2] = maxGeodes(bp, timeLeft, re, r)
            optionCount++
        }
        //make an geode robot
        if (res[0] >= bp[0][4] && res[2] >= bp[0][5]) {
            const r = CopyInt8_4(robots)
            r[3]++
            const re = CopyInt16_4(endRes)
            re[0] -= bp[0][4]
            re[2] -= bp[0][5]
            options[3] = maxGeodes(bp, timeLeft, re, r)
            optionCount++
        }
           
        //do nothing
        if (optionCount < 4) {
            options[4] = maxGeodes(bp, timeLeft, endRes, robots)
        }

        let max = 0
        for (let i = 0; i < 5; i++) {
            if (max < options[i]) {
                max = options[i]
            }
        }

        memos[key] = max
        if (max > bp[1]) bp[1] = max
        return max
    }

    blueprints.map((bp, i) => {
        memos = {}
        return maxGeodes(bp, 32, new Int16Array([0, 0, 0, 0]), new Int8Array([1, 0, 0, 0])).Log()
    }).Product().Log()
}

export function Day18() {
    const lava = Data.map(l => new XYZ(...l.split(',').toIntArray() as [number, number, number]))
    let count = lava.length * 6

    //find bounding box
    const maxXYZ = lava.reduce((a, b) => new XYZ(Math.max(a.X, b.X), Math.max(a.Y, b.Y), Math.max(a.Z, b.Z))).plus(1)
    const minXYZ = lava.reduce((a, b) => new XYZ(Math.min(a.X, b.X), Math.min(a.Y, b.Y), Math.min(a.Z, b.Z))).minus(1)


    //eval from outside bounding box
    const shapeVolume: XYZ[] = []

    maxXYZ.foreachCombination(xyz => {
        shapeVolume.push(xyz)
    }, minXYZ)

    shapeVolume.splice(0, 1)

    const Q = [minXYZ]
    while(Q.length > 0) {
        Q.shift()!.Neighbours(false).forEach(n => {
            if (n.IsGreaterEQAll(minXYZ) && n.IsLessEQAll(maxXYZ) && !lava.find(p => p.EQ(n))) {
                if (shapeVolume.find(p => p.EQ(n))) {
                    if (!Q.find(p => p.EQ(n))) Q.push(n)
                    const i = shapeVolume.findIndex(xyz => xyz.EQ(n))
                    shapeVolume.splice(i, 1)
                }
            }
        })
    }

    lava.forEach(xyz => {
        xyz.Neighbours(false).forEach(n => {
            if (lava.find(p => p.EQ(n))) count--
        })
        const i = shapeVolume.findIndex(p => p.EQ(xyz))
        if (i !== -1) shapeVolume.splice(i, 1)
    })

    count.Log()

    //for all the air left; find how many faces THAT has and subtract them

    shapeVolume.forEach(xyz => {
        xyz.Neighbours(false).forEach(n => {
            if (lava.find(p => p.EQ(n))) count--
        })
    })

    count.Log()
}

export function Day17() {
    const rocks = [
        //1
        Array2D.fromArray([[true, true, true, true]]),
        //2
        Array2D.fromArray([[undefined, true, undefined],
                           [true,  true, true ],
                           [undefined, true, undefined]]),
        //3
        Array2D.fromArray([[true,  true,  true],
                           [undefined, undefined, true],
                           [undefined, undefined, true]]),
        //4
        Array2D.fromArray([[true],
                           [true],
                           [true],
                           [true]]),
        //5
        Array2D.fromArray([[true, true],
                           [true, true]]),
    ]

    const cave = new Array2D<boolean | undefined>(new XY(7, 500_000))
    const jets = Data[0].toArray().map(c => c === '<' ? new XY(-1, 0) : new XY(1, 0))
    let jetIndex = 0
    let rockIndex = 0
    let height = -1
    let offset = 0

    let seen: {[key: string]: [number, number]} = {}


    function summarize() {
        return GArray.Range(0, 7).map(x => {
            for (let y = height; y >= 0; y--) {
                if (cave.get(new XY(x, y))) {
                    return height - y
                }
            }
        })
    }

    for (let rockCount = 0; rockCount < 1_000_000_000_000; rockCount++) {
        //drop tile
        let pos = new XY(2, height + 4)
        const rock = rocks[rockIndex]
        rockIndex++
        rockIndex %= 5

        while (true) {
            //try to make rock go to the side
            let newPos = pos.plus(jets[jetIndex])
            jetIndex++
            jetIndex %= jets.length

            if (!newPos.IsLessEither(XY.Zero) && !newPos.plus(rock.Size).IsGreaterEither(cave.Size)) {
                const overlap = cave.SuperimposeOverlap(rock, newPos)
                if (!overlap) pos = newPos
            }

            //try to make rock fall
            let nnewPos = pos.plus(0, -1)

            if (!nnewPos.IsLessEither(XY.Zero) && !nnewPos.plus(rock.Size).IsGreaterEither(cave.Size)) {
                const overlap = cave.SuperimposeOverlap(rock, nnewPos)
                if (!overlap) pos = nnewPos
                else break
            }
            else break
        }
        cave.SuperimposeSet(rock, pos)

        height = cave.Array.findIndex((arr) => !arr.some(b => b)) - 1

        const key = [jetIndex, rockIndex, summarize()].toString()
        console.log(rockCount, jetIndex, rockIndex, summarize().join(','))
        if (key in seen) {
            const [lastRockCount, lastHeight] = seen[key]
            const remainder = 1_000_000_000_000 - rockCount
            const reps = (remainder / (rockCount - lastRockCount)).Floor()
            offset = reps * (height - lastHeight)
            rockCount += reps * (rockCount - lastRockCount)
            seen = {}
        }
        seen[key] = [rockCount, height]

    }

    

    // cave.Log();
    console.log(height, offset, height + offset +1)

}

export function Day16() {

    const valves = Data.map(v => {
        return {
            name: v.slice(6, 8),
            rate: v.split(' ').at(4)!.slice(5, -1).toInt(),
            adjacents: v.slice(v.indexOf('valv')).RemoveChars([',']).split(' ').slice(1),
        }
    })

    const lookupIndex = valves.map((v, i) =>
        [v.name, i]).toObject() as { [key: string]: number }

    const nodes = valves.map(v => {
        return {
            rate: v.rate,
            adj: v.adjacents.map(a => lookupIndex[a])
        }
    })


    
    const PATH_LEN = 30

    //takes path and returns max Flow on that path
    function traverse(path: number[], totalFlow: number): [number, number[] | null] {

        if (path.length === PATH_LEN) {
            return [totalFlow, path]
        }

        const v = path.at(-1)!


        
        let lastTimeHere: number | null = null

        for (let i = path.length - 2; i >= 0; i--) {
            if (path[i] === v) {
                lastTimeHere = i;
                break;
            }
        }

        if (lastTimeHere && path.length - 1 - lastTimeHere  > 1) {
            let turnedOnSinceLastHere = false
            for (let i = lastTimeHere + 1; i < path.length - 1; i++) {
                if (path[i] === path[i - 1]) {
                    turnedOnSinceLastHere = true
                    break
                }
            }

            if (!turnedOnSinceLastHere) {
                return [0, null]
            }
        }

        // if valve not open
        let open = false
        path.reduce((a, b) => {
            if (a === b && a === v) open = true
            return b
        })

        const options: [number, number[] | null][] = []

        if (!open && valves[v].rate > 0) options.push(traverse(path.concat(v), totalFlow + (PATH_LEN - path.length) * valves[v].rate))

        //skip valve
        for (const a of nodes[v].adj) {
            options.push(traverse(path.concat(a), totalFlow))
        }

        const best = options.reduce((a, b) => {
            if (b[1] === null) return a
            return a[0] > b[0] ? a : b
        }, [0, []])

        return best
    }

    traverse([lookupIndex['AA']], 0).Log() 
}
export function Day16_2() {
    interface Node {
        name: string,
        rate: number,
        adj: string[],
        time: number
    }

    interface State {
        distance: number,
        prevNode: XY | null,
        node: Node
    }

    const nodes = Data.map(v => ({
        name: v.slice(6, 8),
        rate: v.split(' ').at(4)!.slice(5, -1).toInt(),
        adj: v.slice(v.indexOf('valv')).RemoveChars([',']).split(' ').slice(1),
    }))

    const arr = new Array2D<State>(new XY(nodes.length, 30))

    nodes.forEach((n, i) => GArray.Range(0, 30).map(t => {
        const nn = n.Copy() as Node
        nn.time = t

        arr.set(new XY(i, t), {
            distance: Number.POSITIVE_INFINITY,
            prevNode: null,
            node: nn
        })
    }))

    const lookup = nodes.map((n, i) => [n.name, i]).toObject() as {[key: string]: number}

    const firstNodeIndex = lookup['AA']
    arr.get(new XY(firstNodeIndex, 0))!.distance = 0 


    //for each node
    for (let i = 0; i < 29; i++) {

        arr.forEach((state, v) => {
            if (!state) throw new Error()

            const node = state.node

            if (node.time >= 29) return

            const neighbours: [XY, number][] = node.adj.map(s => [new XY(lookup[s], v.Y + 1), 0])

            //see if I can go back to myself (turn myself on)

            const prevs: XY[] = [v]

            //worried about runnig off the end of the array

            while(state.prevNode !== null) {
                prevs.push(state.prevNode)
            }

            let found = false
            
            prevs.Reduce((a, b) => {
                if (a.EQ(b)) found = true
                return [b, a.EQ(b)]
            })

            if (!found) {
                neighbours.push([new XY(v.X, v.Y + 1), 0 - ((29 - i) * node.rate)])
            }


            neighbours.forEach(([u, w]) => {
                //edge

                if (arr.get(v)!.distance + w < arr.get(u)!.distance) {
                    arr.get(u)!.distance = arr.get(v)!.distance + w
                    arr.get(u)!.prevNode = v.Copy()
                }
            })

        })

        //print our shortest dist to each node

        arr.map(state => state?.distance).Log()

    }

    arr.getCol(29).Max()!.Log()


    

    

}

export function Day15() {
    const sensors = Data.map(l => {
        const a = l.RemoveChars([',', ':']).split(' ').map(w => w.slice(2))
        return [new XY(a[2].toInt(), a[3].toInt()),
                new XY(a[8].toInt(), a[9].toInt())] as [XY, XY]
    }).Log()

    const rowY = 3249595

    const squares: BigSet<number> = new BigSet

    sensors.forEach(([s, b], i) => {
        const dist = s.minus(b).TaxicabNorm
        const dy = Math.abs(s.Y - rowY)
        const xHorizon = dist - dy
        if (xHorizon < 0) return
        const range = GArray.Range(s.X - xHorizon, s.X + xHorizon + 1)
        console.log(i.toString().padStart(4),
            'Dist', dist, '\tOverlap:', range.length, '\tFrom:', s.X - xHorizon, '\tTo', s.X + xHorizon + 1)
        range.forEach(x => squares.add(x))
    })

    sensors.forEach(([_, b]) => {
        if (b.Y === rowY) {
            squares.delete(b.X)
        }
    })

    for (let i = 0; i < 4000000; i++) {
        if (!squares.has(i)) {
            i.Log()
            throw new Error()
        }
    }

    // squares.Log()
    squares.size.Log() 
}
export function Day15_2() {

    // example:
    const maxRange = 4000000

    const sensors = Data.map(l => {
        const a = l.RemoveChars([',', ':']).split(' ').map(w => w.slice(2))
        const s = new XY(a[2].toInt(), a[3].toInt())
        const b = new XY(a[8].toInt(), a[9].toInt())

        return [s, s.minus(b).TaxicabNorm] as [XY, number]
    }).Log()

 
    for (let row = 0; row < maxRange; row++) {

        const ranges = sensors.map(([s, dist], i) => {

            const xHorizon = dist - Math.abs(s.Y - row)

            if (xHorizon < 0) return undefined
            return [s.X - xHorizon, s.X + xHorizon] as [number, number]
        }).RemoveUndefined()


        ranges.sort(([a, _], [b, __]) => a - b)

        if (ranges[0][0] > 0) throw new Error()

        const r = ranges.reduce(([a, aa], [b, bb]) => {
            if (aa + 1 >= b) {
                return [a, aa > bb ? aa : bb]
            }
            throw new Error()
        })

        if (r[1] < maxRange) throw new Error()


        if (row % 10000 === 0) row.Log()

    }
}

export function Day14() {
    const lines = Data.map(l => l.split(' -> ')
        .map(xy => new XY(...xy.split(',').toIntArray() as [number, number])))

    const max = lines.flat().reduce((max, xy) => new XY(xy.X > max.X ? xy.X : max.X, xy.Y > max.Y ? xy.Y : max.Y), new XY)
    const min = lines.flat().reduce((min, xy) => new XY(xy.X < min.X ? xy.X : min.X, xy.Y < min.Y ? xy.Y : min.Y), new XY(Number.POSITIVE_INFINITY))
    // const shift = new XY(-min.X, 0)
    const sandPos = new XY(500, 0)

    const arr = new Array2D<boolean>(max.plus(500, 3))
    // rock
    lines.forEach(l => {
        l.reduce((p, c) => {
            if (p.X > c.X) {
                if (p.Y !== c.Y) throw new Error()
                for (let i = c.X; i <= p.X; i++)
                    arr.set(new XY(i, c.Y), true)
            }
            else if (p.X < c.X) {
                if (p.Y !== c.Y) throw new Error()
                for (let i = c.X; i >= p.X; i--)
                    arr.set(new XY(i, c.Y), true)
            }
            else if (p.Y > c.Y) {
                if (p.X !== c.X) throw new Error()
                for (let i = c.Y; i <= p.Y; i++)
                    arr.set(new XY(c.X, i), true)
            }
            else if (p.Y < c.Y) {
                if (p.X !== c.X) throw new Error()
                for (let i = c.Y; i >= p.Y; i--)
                    arr.set(new XY(c.X, i), true)
            }

            return c
        })
    })

    // sand   
    let i = 0 
    let b = true
    while (true) {
        const pos = sandPos.Copy()
        while (true) {
            if (arr.get(pos.plus(0, 1)) === undefined) {
                pos.plusEQ(0, 1)
            }
            else if (arr.get(pos.plus(-1, 1)) === undefined) {
                pos.plusEQ(-1, 1)
            }
            else if (arr.get(pos.plus(1, 1)) === undefined) {
                pos.plusEQ(1, 1)
            }
            else {
                break
            }
            if (pos.IsGreaterEQEither(arr.Size)) {
                b = false
                break
            }
        }
        if (!b) break
        arr.set(pos, false)
        i++
    }


    arr.Log()
    i.Log()
}
export function Day14_2() {
    const lines = Data.map(l => l.split(' -> ')
        .map(xy => new XY(...xy.split(',').toIntArray() as [number, number])))

    const max = lines.flat().reduce((max, xy) => new XY(xy.X > max.X ? xy.X : max.X, xy.Y > max.Y ? xy.Y : max.Y), new XY)
    const min = lines.flat().reduce((min, xy) => new XY(xy.X < min.X ? xy.X : min.X, xy.Y < min.Y ? xy.Y : min.Y), new XY(Number.POSITIVE_INFINITY))
    // const shift = new XY(-min.X, 0)
    const sandPos = new XY(500, 0)

    const arr = new Array2D<boolean>(max.plus(500, 3))
    // rock
    lines.forEach(l => {
        l.reduce((p, c) => {
            if (p.X > c.X) {
                if (p.Y !== c.Y) throw new Error()
                for (let i = c.X; i <= p.X; i++)
                    arr.set(new XY(i, c.Y), true)
            }
            else if (p.X < c.X) {
                if (p.Y !== c.Y) throw new Error()
                for (let i = c.X; i >= p.X; i--)
                    arr.set(new XY(i, c.Y), true)
            }
            else if (p.Y > c.Y) {
                if (p.X !== c.X) throw new Error()
                for (let i = c.Y; i <= p.Y; i++)
                    arr.set(new XY(c.X, i), true)
            }
            else if (p.Y < c.Y) {
                if (p.X !== c.X) throw new Error()
                for (let i = c.Y; i >= p.Y; i--)
                    arr.set(new XY(c.X, i), true)
            }

            return c
        })
    })

    arr.Array.at(-1)?.fill(true)

    // sand   
    let i = 0
    while (true) {
        const pos = sandPos.Copy()
        while (true) {
            if (arr.get(pos.plus(0, 1)) === undefined) {
                pos.plusEQ(0, 1)
            }
            else if (arr.get(pos.plus(-1, 1)) === undefined) {
                pos.plusEQ(-1, 1)
            }
            else if (arr.get(pos.plus(1, 1)) === undefined) {
                pos.plusEQ(1, 1)
            }
            else {
                break
            }
        }
        arr.set(pos, false)
        i++
        if (pos.EQ(sandPos)) break
    }


    arr.Log()
    i.Log()
}

export function Day13() {
    type List = (number | List)[]

    function parseList(l: string): List {
        const list: List = []

        if (!l.startsWith('[') && l.endsWith(']')) 
            throw new Error('bad list')
        let start = 1
        let depth = 0
        for (let i = 0; i < l.length; i++) {
            const char = l.charAt(i)
            if (depth === 1 && (char === ',' || char === ']')) {
                //delim

                if (start !== i) {
                    const e = l.slice(start, i)

                    const intE = parseInt(e)
                    if (!isNaN(intE)) {
                        list.push(e.toInt())
                    }
                    else {
                        //NaN
                        list.push(parseList(e))
                    }
                }


                start = i + 1
            }
            else if (char === '[') depth++
            else if (char === ']') depth--
        }

        return list
    }
    function compare(left: List, right: List): boolean | undefined {
        for (let i = 0; i < left.length && i < right.length; i++) {
            let lVal = left[i]
            let rVal = right[i]

            if (typeof lVal === 'number' && typeof rVal === 'number') {
                //lower int comes first
                if (lVal < rVal) return true
                else if (rVal < lVal) return false
                else continue
            }
            if (typeof lVal === 'number') {
                lVal = [lVal] as List
            }
            if (typeof rVal === 'number') {
                rVal = [rVal] as List
            }
            //both arrs
            const comp = compare(lVal, rVal)
            if (comp !== undefined) return comp
            else continue
        }
        //ran out of items
        if (left.length < right.length)
            return true // correct order
        else if (right.length < left.length)
            return false // wrong order
        return undefined // no determination

    }

    parseList(Data[3])

    DataFull.Split2Lines().map(lines => {
        const [pleft, pright] = lines.SplitLines().map(l => parseList(l))

        return compare(pleft, pright)
    }).Log().reduce((sum, a, i) => sum + (a ? i + 1 : 0), 0).Log()
}
export function Day13_2() {
    type List = (number | List)[]

    function parseList(l: string): List {
        const list: List = []
        let start = 1
        let depth = 0
        for (let i = 0; i < l.length; i++) {
            const char = l.charAt(i)
            
            if (depth === 1 && (char === ',' || char === ']')) {
                //delim

                if (start !== i) {
                    const e = l.slice(start, i)

                    const intE = parseInt(e)
                    if (!isNaN(intE)) {
                        list.push(e.toInt())
                    }
                    else {//NaN
                        list.push(parseList(e))
                    }
                }
                start = i + 1
            }
            else if (char === '[') depth++
            else if (char === ']') depth--
        }
        return list
    }
    function compare(left: List, right: List): boolean | undefined {
        for (let i = 0; i < left.length && i < right.length; i++) {
            let lVal = left[i]
            let rVal = right[i]

            if (typeof lVal === 'number' && typeof rVal === 'number') {
                //lower int comes first
                if (lVal < rVal) return true
                else if (rVal < lVal) return false
                else continue
            }
            if (typeof lVal === 'number') {
                lVal = [lVal] as List
            }
            if (typeof rVal === 'number') {
                rVal = [rVal] as List
            }
            //both arrs
            const comp = compare(lVal, rVal)
            if (comp !== undefined) return comp
            else continue
        }
        //ran out of items
        if (left.length < right.length)
            return true // correct order
        else if (right.length < left.length)
            return false // wrong order
        return undefined // no determination

    }


    const packets = Data.filter(l => l !== '').map((l, i) => [parseList(l), i] as [List, number])

    packets.sort((a, b) => {
        const comp = compare(a[0], b[0])
        if (comp === undefined) return 0
        if (comp === false) return 1
        return -1
    })

    packets.map(p => p[0]).Log();

    const a = packets.findIndex(e => e[1] === 0) + 1,
          b = packets.findIndex(e => e[1] === 1) + 1

    console.log(a, b, a * b)


}

export function Day12() {
    interface Square {
        height: number
        neighbors: XY[]
    }
    
    let start: XY = new XY,
        end: XY = new XY

    let d = Array2D.fromArray(Data.map(l => l.toArray()))
        .map((h, xy) => {
            if (h === 'S') {
                start = xy;
                return 'a'
            }
            else if (h === 'E') {
                end = xy
                return 'z'
            }
            return h
        }).map(e =>
                ({ height: e!.charCodeAt(0) - ('a').charCodeAt(0) } as Square))

    d.forEach((node, xy) => {
        node!.neighbors = xy.Neighbours(false).filter(nxy => d.get(nxy) && d.get(nxy)!.height <= node!.height + 1 )
    })

    d.map(h => h?.height).Log()

    const pathlen = (s: XY) => {
        // Dijkstra's Algorithm

        interface Node {
            square: Square
            distance: number
            visited: boolean
        }

        const dd = new Array2D<Node>(d.Size).map((_, xy) => ({
            square: d.get(xy)!,
            distance: Number.POSITIVE_INFINITY,
            visited: false
        }))

        const unvistied = dd.Entries().filter(n => !n[1].visited)
        dd.get(s)!.distance = 0
        let currXY: XY = s

        for (let i = 0; ; i++) {
            if (currXY.EQ(end)) break

            const node = dd.get(currXY)!;

            node.square.neighbors.forEach(neighbour => {
                const n = dd.get(neighbour)
                if (n && !n.visited) {
                    n.distance = [n.distance, node.distance + 1].Min()
                }
            })
            node.visited = true
            unvistied.splice(unvistied.findIndex(val => val[0].EQ(currXY)), 1)

            currXY = unvistied.reduce((least, val) => {
                if (val[1].distance < least[1].distance) least = val
                return least
            }, [new XY, { distance: Number.MAX_VALUE }] as [XY, Node])[0]
        }

        return dd.get(currXY)!.distance
    }

    pathlen(start).Log()
}
export function Day12_2() {
    interface Square {
        height: number
        neighbors: XY[]
    }
    let end: XY = new XY

    let d = Array2D.fromArray(Data.map(l => l.toArray()))
        .map((h, xy) => {
            if (h === 'S') return 'a'
            else if (h === 'E') {
                end = xy
                return 'z'
            }
            return h
        }).map(e =>
            ({ height: e!.charCodeAt(0) - ('a').charCodeAt(0) } as Square))

    d.forEach((node, xy) => {
        node!.neighbors = xy.Neighbours(false).filter(nxy => d.get(nxy) && d.get(nxy)!.height >= node!.height - 1)
    })

    d.map(h => h?.height).Log()


    // const starts = d.Entries().filter(s => s[1].height === 0).map(s => s[0])


    const pathlen = (s: XY) => {
        // Dijkstra's Algorithm backwards

        interface Node {
            square: Square
            distance: number
            visited: boolean
        }

        const dd = new Array2D<Node>(d.Size).map((_, xy) => ({
            square: d.get(xy)!,
            distance: Number.POSITIVE_INFINITY,
            visited: false
        }))

        const unvistied = dd.Entries().filter(n => !n[1].visited)
        dd.get(s)!.distance = 0
        let currXY: XY = s

        for (let i = 0; ; i++) {
            const node = dd.get(currXY)!;

            if (node.square.height === 0) break

            node.square.neighbors.forEach(neighbour => {
                const n = dd.get(neighbour)
                if (n && !n.visited) {
                    n.distance = [n.distance, node.distance + 1].Min()
                }
            })
            node.visited = true
            unvistied.splice(unvistied.findIndex(val => val[0].EQ(currXY)), 1)

            currXY = unvistied.reduce((least, val) => {
                if (val[1].distance < least[1].distance) least = val
                return least
            }, [new XY, { distance: Number.MAX_VALUE }] as [XY, Node])[0]
        }

        return dd.get(currXY)!.distance
    }

    pathlen(end).Log()
}

export function Day11() {

    class Monkey {
        Items: number[] = []
        private Operator: '*' | '+'
        private Operand: number
        Test: number
        IfTrue: number
        IfFalse: number

        Inspected = 0

        Operation() {
            this.Inspected++
            if (this.Operator === '+')
                this.Items[0] += this.Operand
            else if (this.Operator === '*')
                this.Items[0] *= this.Operand
            else 
                this.Items[0] **= this.Operand
        }

        Bore() {
            this.Items[0] = (this.Items[0] / 3).Floor()
        }

        TestItem() {
            const Item = this.Items[0]
            if (Item % this.Test === 0) {
                monkeys[this.IfTrue].Items.push(this.Items.shift()!)
            }
            else {
                monkeys[this.IfFalse].Items.push(this.Items.shift()!)
            }
        }

        constructor(i: string, op: string, te: string, t: string, f: string) {
            this.Items = i.slice(16).split(', ').toIntArray()
            const o = op.slice(21).replace('* old', '^ 2').split(' ')
            this.Operator = o[0] as typeof this.Operator
            this.Operand = o[1].toInt()
            this.Test = te.slice(19)!.toInt()
            this.IfTrue = t.at(-1)!.toInt()
            this.IfFalse = f.at(-1)!.toInt()
        }
    }

    const monkeys = DataFull.Split2Lines().map(m => 
        new Monkey (...m.SplitLines().map(l => l.trim()).slice(1) as [string, string, string, string, string])
    )


    GArray.Range(0, 20).forEach(I =>
        monkeys.forEach(m => {
            while (m.Items.length > 0) {
                m.Operation()
                m.Bore()
                m.TestItem()
            }
        })
    )


    monkeys.map(m => m.Inspected).sort(Sorts.GreatestFirst).slice(0, 2).Product().Log()
}
export function Day11_2() {

    class Monkey {
        Items: number[] = []
        private Operator: '*' | '+' | '^'
        private Operand: number
        Test: number
        IfTrue: number
        IfFalse: number

        Inspected = 0

        Operation(prod: number) {
            this.Inspected++
            if (this.Operator === '+')
                this.Items[0] += this.Operand
            else if (this.Operator === '*')
                this.Items[0] *= this.Operand
            else
                this.Items[0] **= this.Operand

            this.Items[0] %= prod
        }

        TestItem() {
            const Item = this.Items[0]
            if (Item % this.Test === 0) {
                monkeys[this.IfTrue].Items.push(this.Items.shift()!)
            }
            else {
                monkeys[this.IfFalse].Items.push(this.Items.shift()!)
            }
        }

        constructor(i: string, op: string, te: string, t: string, f: string) {
            this.Items = i.slice(16).split(', ').toIntArray()
            const o = op.slice(21).replace('* old', '^ 2').split(' ')
            this.Operator = o[0] as typeof this.Operator
            this.Operand = o[1].toInt()
            this.Test = te.slice(19)!.toInt()
            this.IfTrue = t.at(-1)!.toInt()
            this.IfFalse = f.at(-1)!.toInt()
        }
    }

    const monkeys = DataFull.Split2Lines().map(m =>
        new Monkey(...m.SplitLines().map(l => l.trim()).slice(1) as [string, string, string, string, string])
    )

    const prod = monkeys.map(m => m.Test).Product()


    GArray.Range(0, 10_000).forEach(I =>
        monkeys.forEach((m, i) => {
            while (m.Items.length > 0) {
                m.Operation(prod)
                m.TestItem()
            }
        })
    )
    
    monkeys.map(m => m.Inspected).Log()
    monkeys.map(m => m.Inspected).sort(Sorts.GreatestFirst).slice(0, 2).Product().Log()
}

export function Day10() {
    let X = 1
    let cycle = 0
    let strengths = 0

    const Cycle = () => {
        cycle++
        if (cycle % 40 === 20) {
            strengths += cycle * X
            console.log(cycle, X)
        }
    }

    Data.forEach(instruction => {
        const i = instruction.split(' ')
        Cycle()
        if (i[0] === 'addx') {
            Cycle()
            X += i[1].toInt()
        }
    })

    strengths.Log()
}
export function Day10_2() {
    let X = 1
    let cycle = 0
    const screen: string[] = [] // 240

    const Cycle = () => {
        screen[cycle] = (X - (cycle % 40)).InRangeEq(-1, 1) ? '#' : '.'
        cycle++
    }

    Data.forEach(instruction => {
        const i = instruction.split(' ')
        Cycle()
        if (i[0] === 'addx') {
            Cycle()
            X += i[1].toInt()
        }
    })

    GArray.Range(0, 6).map(i => {
        screen.slice(i * 40, (i + 1) * 40).join('').Log()
    })
}

export function Day9() {

    let head = new XY,
        tail = new XY,
        tailPath = [new XY]

    const getPos = (follower: XY, leader: XY): XY => {
        const n = leader.Neighbourhood(true)
        if (!n.some(e => e.EQ(follower))) {

            //move tail
            const diff = follower.minus(leader)

            const d = diff.div(2)

            if (d.X < 0.9 && d.X > -0.9) d.X = 0
            if (d.Y < 0.9 && d.Y > -0.9) d.Y = 0

            return leader.plus(d)
        }
        return follower
    }

    Data.flatMap(l => GArray.Range(0, l.split(' ')[1].toInt()).map(_ => new XY(
        (l.startsWith('R') ? 1 : l.startsWith('L') ? -1 : 0),
        (l.startsWith('U') ? 1 : l.startsWith('D') ? -1 : 0))))
    .forEach((motion, i, a) => {

        // if (i % 50 === 0) {
        //     const arr = new Array2D(new XY(250))
        //     tailPath.forEach(xy => arr.set(xy.plus(15), '#'))
        //     arr.set(tail.plus(15), 'T')
        //     arr.set(head.plus(15), 'H')
        //     Array2D.fromArray(arr.Array.Reverse()).Log()

        //     console.log('Path: ', tailPath.length, 'Progress: ', (i / a.length * 100) + '%')
        // }

        head.plusEQ(motion)

        tail = getPos(tail, head)

        if(tailPath.every(p => !p.EQ(tail)))
            tailPath.push(tail.Copy())
        
        console.log(i, head.toString(), tail.toString())

    })

    console.log(head.toString(), tail.toString())

    tailPath.length.Log()


    // const arr = new Array2D(new XY(250))
    // arr.set(new XY(15), 's')
    // tailPath.forEach(xy => arr.set(xy.plus(15), '#'))
    // Array2D.fromArray(arr.Array.Reverse()).Log()
   
}
export function Day9_2() {

    let snake = GArray.Range(0, 10).map(_ => new XY),
        tailPath = [new XY]

    const getPos = (follower: XY, leader: XY): XY => {
        return (!leader.Neighbourhood(true).some(e => e.EQ(follower))) ?
            leader.plus(follower.minus(leader).div(2).Trunc()) :
            follower
    }

    Data.flatMap(l => GArray.Range(0, l.split(' ')[1].toInt()).map(_ => new XY(
        (l.startsWith('R') ? 1 : l.startsWith('L') ? -1 : 0),
        (l.startsWith('U') ? 1 : l.startsWith('D') ? -1 : 0))))
        .forEach((motion, i) => {
            snake[0].plusEQ(motion)

            snake.slice(1).reduce((leader, follower, ii) => {
                snake[ii + 1] = getPos(follower, leader)
                return snake[ii + 1]
            }, snake[0])

            if (tailPath.every(p => !p.EQ(snake.at(-1)!)))
                tailPath.push(snake.at(-1)!.Copy())

            console.log(i.toString().padEnd(4).AsColor(Console.Yellow), snake.map(r => r.toString()).join('\t'))
        })

    tailPath.length.Log()
}

export function Day8() {
    Array2D.fromArray(Data.map(l => l.toArray().toIntArray())).Log().map((tree, xy, a) => {
        if (tree === undefined) throw new Error()
        //check 
        const col = a.getCol(xy.X)
        const row = a.getRow(xy.Y)

        const n = col.slice(0, xy.Y),
            w = row.slice(0, xy.X),
            s = col.slice(xy.Y + 1),
            e = row.slice(xy.X + 1);

        return ([n, w, s, e]).some(dir => dir.every(t => t! < tree))
        
    }).Log().Flatten().Count().Log()
}   
export function Day8_2() {
    Array2D.fromArray(Data.map(l => l.toArray().toIntArray()))
    .map((tree, xy, a) =>
        [
            a.getCol(xy.X).slice(0, xy.Y).Reverse(), // n
            a.getRow(xy.Y).slice(0, xy.X).Reverse(), // w
            a.getCol(xy.X).slice(xy.Y + 1),          // s
            a.getRow(xy.Y).slice(xy.X + 1)           // e
        ].map(dir => 
            dir.Reduce((s, t) => [s! + 1, t! >= tree!], 0)
        ).Product()
    ).Flatten().Max().Log()
}

export function Day7() {
    class Directory {
        constructor(public Name: string, public Parent: null | Directory = null) {}
        Children: Array<Directory | File> = []

        GetSize(): number {
            return this.Children.map(c => c.GetSize()).Sum()
        }
    }
    class File {
        public Size: number
        constructor (size: string, public Name: string) {
            this.Size = size.toInt()
        }
        GetSize() { return this.Size }
    }

    const system = new Directory('/')

    const stack = Data.reduce((path, l) => {
        if (l.startsWith('$')) {
            l = l.slice(2)
            if (l.startsWith('cd')) {
                l = l.slice(3)
                if (l.startsWith('..')) {
                    path.Pop()
                }
                else {
                    // cd into dir
                    const child = path.Peek()!.Children.find(c => c.Name === l) as Directory | undefined
                    if (!child) throw new Error('could not find dir of name ' + l)
                    path.Push(child)

                }
            }
        }
        else {
            if (l.startsWith('dir')) {
                l = l.slice(4)
                path.Peek()!.Children.push(new Directory(l, path.Peek()!))
            }
            else {
                // file
                path.Peek()!.Children.push(new File(...l.split(' ') as [string, string]))
            }
        }
        return path
    }, new Stack<Directory>([system])).Log()

    system.Log()

    const reqSize = system.GetSize().Log() - 40_000_000

    const n: number[] = []
    
    function func(d: Directory) {
        d.Children.forEach(c => {
            if ((c as Directory).Children) {
                const s = c.GetSize()
                if (s >= reqSize) {
                    n.push(s)
                }
                func(c as Directory)
            }
        })
    }
    func(system)

    n.Min().Log()
}
export function Day7_2() {
    class Directory {
        Children: Directory[] = []
        Parent: Directory | null

        constructor(public Name: string, Parent: null | Directory) {
            this.Parent = Parent
        }

        protected Size?: number
        GetSize(): number | undefined {
            return this.Children.flatMap(c => c.Size ?? c.GetSize()).UndefinedIfEmpty()?.Sum() 
        }

        GetMin = (min?: number) => min ?? ((this.GetSize() ?? Number.MAX_VALUE) - 40_000_000)

        Part1(): number {
            return this.Children.flatMap(c => 
                (c.GetSize() && c.GetSize()! <= 100_000) ? c.GetSize()! : 0
            ).concat(
                this.Children.flatMap(c => c.Part1())
            ).UndefinedIfEmpty()?.Sum() ?? 0
        }

        Part2(min?: number): number | undefined {
            return this.Children.flatMap(c =>
                (c.GetSize() && (c.GetSize()! >= this.GetMin(min))) ? c.GetSize() : []
            ).concat(
                this.Children.flatMap(c => c.Part2(this.GetMin(min)) ?? [])
            ).UndefinedIfEmpty()?.Min() 
        }
    }
    class File extends Directory {
        constructor(Size: string, Name: string) {
            super(Name, null)
            this.Size = Size.toInt()
        }
    }

    Data.reduce(([system, path], l) => {
        if (l.startsWith('$ cd')) {
            if (l.includes('..'))
                path.Pop()
            else // cd into dir
                path.Push(l.slice(5) === '/' ? system : path.Peek()!.Children.find(c => c.Name === l.slice(5))!)
        }
        else if (!l.startsWith('$ ls')) { // part of an ls
            path.Peek()!.Children.push(l.startsWith('dir') ? 
                new Directory(l.slice(4), path.Peek()!) :      // dir
                new File(...l.split(' ') as [string, string]))  // file
        }
        return [system, path] as [Directory, Stack<Directory>]
    }, [new Directory('/', null), new Stack<Directory>()] as [Directory, Stack<Directory>])[0]
    .Part1()?.Log()
}

export function Day6() {
    (Data[0].toArray().findIndex((_, i, a) => 
        a.slice(i, i + 4).Uniques().length == 4
    ) + 4).Log()
}
export function Day6_2() {
    (Data[0].toArray().findIndex((_, i, a) =>
        a.slice(i, i + 14).Uniques().length == 14
    ) + 14).Log()
}

export function Day5() {
    const [t, m] = DataFull.Split2Lines().map(a => a.SplitLines())
    const count = ((t.at(-1)!.length + 1) / 4).Log()
    const towers: Stack<string>[] = GArray.Range(0, count).map(_ => new Stack)
    const l = t.slice(0, -1)
    l.reverse()
    l.Log()
    l.forEach(line => {
        GArray.Range(0, count).forEach(i => {
            const char = line.charAt(i * 4 + 1)
            if (char !== ' ') towers[i].Push(char)
        })
    })
    const moves = m.map(m => {
        const a = m.split(' ')
        return [a[1], a[3], a[5]].toIntArray()
    })


    //towers & moves

    towers.Log()
    moves.Log()


    moves.forEach(m => {
        const [count, from, to] = m;
        GArray.Range(1, count + 1).forEach(_ => {
            towers[to - 1].Push(towers[from - 1].Pop()!)
        })
    })

    towers.map(t => t.Peek()).join('').Log()
}
export function Day5_2() {
    const [t, m] = DataFull.Split2Lines().map(a => a.SplitLines())
    const count = ((t.at(-1)!.length + 1) / 4)
    const towers: Stack<string>[] = GArray.Range(0, count).map(_ => new Stack)
    t.slice(0, -1).Reverse().forEach(line => {
        GArray.Range(0, count).forEach(i => {
            const char = line.charAt(i * 4 + 1)
            if (char !== ' ') towers[i].Push(char)
        })
    })

    m.map(m => {
        const a = m.split(' ')
        return [a[1], a[3], a[5]].toIntArray()
    }).forEach(m => {
        const [count, from, to] = m;

        GArray.Range(1, count + 1).map(_ =>
            towers[from - 1].Pop()!
        ).Reverse().forEach(t => {
            towers[to - 1].Push(t)
        })
    })

    towers.map(t => t.Peek()).join('').Log()
}

export function Day4() {
    Data.map(l => {
        const [d1, d2] = l.split(',').map(r => GArray.Range(...r.split('-').toIntArray() as [number, number])) as [number[], number[]]

        return d1.every(n => d2.includes(n)) || d2.every(n => d1.includes(n)) ? 1 : 0
    }).Sum().Log()
}
export function Day4_2() {
    Data.Count(l => {
        const [d1, d2] = l.split(',').map(r => GArray.Range(...r.split('-').toIntArray() as [number, number])) as [number[], number[]]

        return d1.Intersect(d2).length > 0

        // return d1.some(n => d2.includes(n)) || d2.some(n => d1.includes(n))
    }).Log()
}

export function Day3() {
    Data.map(sack => {
        const s = sack.toArray()
        const c1 = s.slice(0,s.length / 2),
            c2 = s.slice(s.length / 2)
        // c1.Log()
        // c2.Log()

        const code = c1.filter(c => c2.includes(c))[0].charCodeAt(0)
        return code - (code > 90 ? 96 : 38)

    }).Log().Sum().Log()
}
export function Day3_2() {
    const out: string[] = []
    for (let i = 0; i < Data.length; i += 3) {
        const arr = [Data[i].toArray(), Data[i + 1].toArray(), Data[i + 2].toArray()]

        // out.push(arr[0].filter(c => arr[1].includes(c)).filter(c => arr[2].includes(c))[0])

        out.push(arr[0].Intersect(arr[1]).Intersect(arr[2])[0])

    }

    out.Log()

    out.map(char => {
        const code = char.charCodeAt(0)
        return code - (code > 90 ? 96 : 38)
    }).Sum().Log()
}

export function Day2() {
    Data.map(d => {
        const p = d.ReplaceMap({
            'A': '0', // rock
            'B': '1', // paper
            'C': '2', // scissors

            'X': '0', // rock
            'Y': '1', // paper
            'Z': '2'  // scissors
        }).split(' ').toIntArray().Log()
        let score = p[1] + 1

        if (p[0] === p[1]) return score + 3

        if ((p[0] + 1) % 3 === p[1]) return score + 6
        
        return score;
    }).Log().Sum().Log()
}
export function Day2_2() {
    Data.map(d => {
        const p = d.ReplaceMap({
            'A': '0', // rock
            'B': '1', // paper
            'C': '2', // scissors
        }).split(' ').Log()
        let score = p[0].toInt().Log()

        if (p[1] === 'X') {
            //lose
            return 1 + ((score + 2) % 3)
        } else if (p[1] === 'Y') {
            //draw
            return 1 + score + 3
        } else {
            //win
            return 1 + ((score + 1) % 3) + 6
        }


    }).Log().Sum().Log()
}

export function Day1() {
    DataFull.Split2Lines().map(e => e.toIntList().Sum()).Max().Log()

    let max = 0
    let e: number | undefined = undefined;
    DataFull.split('\n\n').forEach((v,i) => {
        const sum = v.toIntList().Sum()
        if (sum > max) {
            max = sum
            e = i
        }
    })
    console.log(e)
    max.Log()
}
export function Day1_2() {
    DataFull.Split2Lines().map(v =>
        v.toIntList().Sum())
    .Sort(Sorts.GreatestFirst)
    .slice(0,3).Sum().Log()
}