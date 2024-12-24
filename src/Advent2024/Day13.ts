import { n2 } from "../Glib/Array";
import { XY } from "../Glib/XY";
import { DataFull } from "../main";


class Game {
    public A: XY
    public B: XY
    public Prize: XY

    constructor(lines: string[]) {
        this.A = XY.fromTuple(lines[0].split(' ').slice(2).Run(x => x.slice(2, -1), y => y.slice(2)).toIntArray() as n2)
        this.B = XY.fromTuple(lines[1].split(' ').slice(2).Run(x => x.slice(2, -1), y => y.slice(2)).toIntArray() as n2)
        this.Prize = XY.fromTuple(lines[2].split(' ').slice(1).Run(x => x.slice(2, -1), y => y.slice(2)).toIntArray() as n2)
        this.Prize.plusEQ(10000000000000)
    }

    getLinearCombo() {
        const B = (this.Prize.Y * this.A.X - this.A.Y * this.Prize.X)/(this.B.Y * this.A.X - this.A.Y * this.B.X)
        const A = (this.Prize.X - this.B.X * B) / this.A.X

        return [A, B]
    }
}

const games = DataFull.Split2Lines().map(l => new Game(l.SplitLines()))

games.Log()

games.Accumulate(g => {
    const [a, b] = g.getLinearCombo().Log()

    if (a.IsInteger() && b.IsInteger()) {
        return a * 3 + b
    }
    return 0
}).Log()