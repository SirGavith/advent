import { Array2D, XY } from "../Glib/XY";
import { PriorityQueue } from "../Glib/PriorityQueue";
import { DataFull } from "../main";

const arr = Array2D.fromString(DataFull)

const visited = new Map<string, [num, Move[]]>()
const end = arr.Find('E')!

class Move {
    constructor(public XY: XY, public Score: num, public Facing: XY, public Prev: Move | undefined = undefined) {}
    getStr() { return this.XY.toString() + this.Facing.toCardinalString() }
}

const queue = new PriorityQueue<Move>((a,b) => a.Score < b.Score)
queue.push(new Move(arr.Find('S')!, 0, XY.East))

while (!queue.isEmpty()) {
    const move = queue.pop()!
    const str = move.getStr()

    if (visited.has(str)) {
        const tile = visited.get(str)!
        if (tile[0] < move.Score) continue // current path is bad
        if (tile[0] === move.Score) {
            //paths are equally good
            tile[1].push(move.Prev!)
            continue
        }
    }
    
    // current path is better
    visited.set(str, [move.Score, move.Prev ? [move.Prev] : []])
    

    if (move.XY.EQ(end)) {
        move.Log()
        move.Score.Log()

        let s = new Set<string>()

        function recurse (m: Move) {
            s.add(m.XY.toString())
            visited.get(m.getStr())![1].forEach(mm => recurse(mm))
        }

        recurse(move)

        s.Log()
        s.forEach(ss => arr.set(XY.fromString(ss), 'O'))
        
        s.size.Log()
        arr.Log()
        break
    }
    

    const fxy = move.XY.plus(move.Facing)
    if (arr.get(fxy)?.in('E') ?? true) {
        queue.push(new Move(fxy, move.Score + 1, move.Facing, move))
    }

    queue.push(new Move(move.XY, move.Score + 1000, move.Facing.RotateCCW(), move))
    queue.push(new Move(move.XY, move.Score + 1000, move.Facing.RotateCW(), move))
}
