import { Range } from "../Glib/Array";
import { Array2D, XY } from "../Glib/XY";
import { Data } from "../main";

const numericKeypad = Array2D.fromString('789\n456\n123\n.0A')
const arrowKeypad = Array2D.fromString('.^A\n<v>')

function getKeypadStepOptions(from: XY, to: XY, keypad: Array2D<string>): string[] {
    if (from.EQ(to)) return ['A']

    const dr = to.minus(from)
    const ewFirst = [], nsFirst = []

    for (let x = 0; x < Math.abs(dr.X); x++)
        ewFirst.push(new XY(Math.sign(dr.X), 0).toArrowString())
    for (let y = 0; y < Math.abs(dr.Y); y++) {
        ewFirst.push(new XY(0, Math.sign(dr.Y)).toArrowString())
        nsFirst.push(new XY(0, Math.sign(dr.Y)).toArrowString())
    }
    for (let x = 0; x < Math.abs(dr.X); x++)
        nsFirst.push(new XY(Math.sign(dr.X), 0).toArrowString())
    ewFirst.push('A')
    nsFirst.push('A')

    if (dr.X === 0 || dr.Y === 0 ||
        (from.X === 0 && ((keypad === numericKeypad && to.Y === 3) ||
                          (keypad === arrowKeypad && to.Y === 0))))
        return [ewFirst.join('')]

    if ((to.X === 0 && ((keypad === numericKeypad && from.Y === 3) ||
                        (keypad === arrowKeypad && from.Y === 0))))
        return [nsFirst.join('')]
    
    return [ewFirst.join(''), nsFirst.join('')]
}

function recursivlyExpandAllCombos(steps: string[][]): string[] {

    let stack: {i: num, combo: string[]}[] = [{i: 0, combo: []}]
    let combos: string[] = []

    while (stack.length > 0) {
        const {i, combo} = stack.pop()!
        if (i === steps.length) {
            combos.push(combo.join(''))
            continue
        }

        steps[i].forEach(s => {
            let c = combo.Copy()
            c.push(s)
            stack.push({i: i + 1, combo: c})
        })
    }
    
    return combos
}

function getKeypadSeqs(seq: string, keypad: Array2D<string>) {
    let pos = keypad.Find('A')!
    let steps: string[][] = []

    seq.toArray().forEach((next) => {
        const nxy = keypad.Find(next)!
        let s = getKeypadStepOptions(pos, nxy, keypad)
        steps.push(s)
        pos = nxy
    })

    let combos: string[] = recursivlyExpandAllCombos(steps)

    return combos
}

Data.map(l => {
    let minLengthSeq = Number.MAX_VALUE
    
    const depressurizedRobotSeqs = getKeypadSeqs(l, numericKeypad)
    // console.log('taking first')
    depressurizedRobotSeqs.forEach(seq => {
        const radiationRobotSeqs = getKeypadSeqs(seq, arrowKeypad)
        radiationRobotSeqs.forEach(seq => {
            const coldRobotSeqs = getKeypadSeqs(seq, arrowKeypad)
            coldRobotSeqs.forEach(seq => {
                minLengthSeq = Math.min(minLengthSeq, seq.length)
            })
        })
    })

    // console.log('taking first')
    // console.log('taking first')
    
    console.log(l, minLengthSeq, l.slice(0, -1).toInt())
    return minLengthSeq * l.slice(0, -1).toInt()
}).Sum().Log()