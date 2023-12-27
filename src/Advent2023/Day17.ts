import { Array2D, XY } from "../Glib/XY";
import * as Console from "../Glib/Console";
import { DataFull } from "../main";
import { n3, n9 } from "../Glib/Array";

const arr = Array2D.fromString(DataFull)

const h = Array(9).fill(Number.MAX_VALUE) as n9

const minHeats = arr.map(_ => ({
    '0,1': h.CopyFast(),
    '1,0': h.CopyFast(),
    '0,-1': h.CopyFast(),
    '-1,0': h.CopyFast(),
}))
minHeats.set(XY.Zero, {
    '0,1': [0, 0, 0],
    '1,0': [0, 0, 0],
    '0,-1': h.CopyFast(),
    '-1,0': h.CopyFast(),
})

arr.set(XY.Zero, '0')

const stack = [{
    pos: XY.Zero,
    minHeat: 0,
    dir: XY.Zero,
    length: 20,
    path: [] as XY[]
}]

//took 5 min to run part 2 but good enough :)

while(stack.length > 0) {
    //find least-valued leaf
    const node = stack.pop()!
    const addHeat = arr.get(node.pos)?.toInt()
    if (addHeat === undefined) continue

    //if not starting node
    if (node.length !== 20) {

        const heats = minHeats.get(node.pos)
        const d = node.dir.toString() as '0,1' | '1,0' | '0,-1' | '-1,0'
        //set visited & min heat
        if (heats![d][node.length] < Number.MAX_SAFE_INTEGER) continue
        if (heats![d][node.length] > node.minHeat) {
            heats![d][node.length] = node.minHeat
        }
    }


    //END CASE
    if (node.pos.EQ(arr.Size.minus(1))) {
        console.log(`Found end node`, node, node.minHeat + addHeat)

        arr.map((c, xy) => 
            (node.path.some(pxy => xy.EQ(pxy)) ? Console.BgRed : '') + c + Console.BgBlack
        ).Log()

        break
    }

    //STRAIGHT
    if (node.length < 9) {
        stack.push({
            pos: node.pos.plus(node.dir),
            minHeat: node.minHeat + addHeat,
            dir: node.dir,
            length: node.length + 1,
            path: node.path.CopyFast().Push(node.pos)
        })
    }
    //TURNS
    if (node.length >= 3) {
        if (node.dir !== XY.Right && node.dir !== XY.Left) {
            stack.push({
                pos: node.pos.plus(XY.Right),
                minHeat: node.minHeat + addHeat,
                dir: XY.Right,
                length: 0,
                path: node.path.CopyFast().Push(node.pos)

            })
            stack.push({
                pos: node.pos.plus(XY.Left),
                minHeat: node.minHeat + addHeat,
                dir: XY.Left,
                length: 0,
                path: node.path.CopyFast().Push(node.pos)

            })
        }
        if (node.dir !== XY.Up && node.dir !== XY.Down) {
            stack.push({
                pos: node.pos.plus(XY.Up),
                minHeat: node.minHeat + addHeat,
                dir: XY.Up,
                length: 0,
                path: node.path.CopyFast().Push(node.pos)
            })
            stack.push({
                pos: node.pos.plus(XY.Down),
                minHeat: node.minHeat + addHeat,
                dir: XY.Down,
                length: 0,
                path: node.path.CopyFast().Push(node.pos)
            })
        }
    }

    stack.sort((a, b) => b.minHeat - a.minHeat)
} 
