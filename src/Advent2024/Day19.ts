import { DataFull } from "../main";

const [options, designs] = DataFull.Split2Lines().Run(
    a => new Set<string>(a.split(', ')),
    b => b.SplitLines())
const maxOptionLen = options.toArray().map(o => o.length).Max()

const memo = new Map<string, number>()

function waysPossible(str: string) {
    if (str === '') return 1
    if (memo.has(str)) return memo.get(str)!
    let ways = 0
    for (let i = 1; i <= Math.min(maxOptionLen, str.length); i++) {
        if (options.has(str.slice(0, i))) {
            ways += waysPossible(str.slice(i))
        }
    }
    memo.set(str, ways)
    return ways
}

designs.Accumulate((design, t) => {
    const ways = waysPossible(design)
    // console.log(t, ways)
    return ways
}).Log()