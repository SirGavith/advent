import { Data, DataFull } from "../main";


let [[A, B, C], p] = DataFull.Split2Lines().Run(
    a => a.SplitLines().map(l => l.split(': ').at(-1)!.toInt()),
    b => b.split(': ').at(-1)!.toIntList(','))
let IP = 0
let outputBuffer: number[] = []

function getCombo(opr: num) {
    if (opr <= 3) return opr
    if (opr === 4) return A
    if (opr === 5) return B
    if (opr === 6) return C
    throw new Error('invalid combo opr')
}

const instructions = [
    (opr: num) => { // adv
        A >>= getCombo(opr)
    },
    (opr: num) => { // bxl
        B ^= opr
    },
    (opr: num) => { // bst
        B = getCombo(opr) & 7
    },
    (opr: num) => { // jnz
        if (A !== 0) IP = opr - 2
    },
    (opr: num) => { // bxc
        B ^= C
    },
    (opr: num) => { // out
        outputBuffer.push(getCombo(opr) & 7)
        console.log(getCombo(opr) & 7)
    },
    (opr: num) => { // bdv
        B = A >> getCombo(opr)
    },
    (opr: num) => { // cdv
        C = A >> getCombo(opr)
    }
]

const decoded: [string, boolean][] = [
    ['adv', true],
    ['bxl', false],
    ['bst', true],
    ['jnz', false],
    ['bxc', false],
    ['out', true],
    ['bdv', true],
    ['cdv', true]]

function decode(opc: num, opr: num) {
    const [str, combo] = decoded[opc]
    const oprstr = opc === 4 ? '-' : combo ? getCombo(opr).toString(16) : opr.toString(16)
    return str + " " + oprstr
}

// console.log('i, IP A B C:')
// for (let i = 0; IP < p.length; i++) {
//     const opc = p[IP], opr = p[IP + 1]
//     instructions[opc](opr)
//     console.log(i.toString().padEnd(3), IP.toString().padEnd(3), decode(opc, opr).padEnd(15),
//     A.toString(2).padEnd(30), B.toString(2).padEnd(30), C.toString(2).padEnd(30))
//     IP += 2
// }
// console.log('Output:')
// console.log(outputBuffer.join(','))


function Run(A: bigint) {
    let outputBuffer = []
    while (A > 0) {
        let b = A & 7n
        
        b = b ^ 0b011n ^ ((A >> (b ^ 0b101n)) & 7n)
        
        outputBuffer.push(b)
        A >>= 3n
    }
    return outputBuffer
}


function recurse(seq: num[], i: num, N: bigint): bigint {
    if (i === seq.length) {
        console.log('found soln', N) // by construction, we always find smallest first
        return N
    }

    for (let x = 0n; x < 8n; x++) {
        let testN = (N << 3n) | x
        let out = Number(x ^ 0b011n ^ ((testN >> (x ^ 0b101n)) & 7n))
        
        if (out === seq[i]) {
            let N = recurse(seq, i + 1, testN)
            if (N > 0n) return N
        }
    }
    return 0n
}


let desired_seq = '2,4,1,5,7,5,0,3,1,6,4,3,5,5,3,0'.toIntList(',').Log().Reverse()
Run(recurse(desired_seq, 0, 0n)).Log()
