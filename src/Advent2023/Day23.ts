import { BgRed, Reset } from "../Glib/Console";
import { Array2D, XY } from "../Glib/XY";
import { DataFull } from "../main";

const arr = Array2D.fromString(DataFull)
const startPosStr = XY.East.toString()
const destPosStr = arr.Size.minus(2, 1).toString()


//posStr -> [Junction, weight]
const connections = new Map<string, Map<string, number>>()

const startJunction = new Map<string, number>()
const endJunction = new Map<string, number>()
{
    connections.set(startPosStr, startJunction)
    connections.set(destPosStr, endJunction)

    // [pos, dir, weight, lastJunction]
    const Q: [XY, XY, number, string, XY[]][] = [
        [XY.East.Copy(), XY.South, 0, startPosStr, []],
    ]

    while (Q.length > 0) {
        const [pos, dir, weight, lastJunctionStr, path] = Q.pop()!
        // console.log('at', pos, dir.toCardinalString(), weight)

        const options = arr.Neighbours(pos).filter(n => n[1] !== '#')
        if (options.length === 2 || pos.EQ(XY.East)) {
            options.forEach(([npos, _]) => {
                if (npos.plus(dir).EQ(pos)) return
                Q.push([npos, npos.minus(pos), weight + 1, lastJunctionStr, path.concat(pos)])
            })
        }
        else {
            //junction
            // const logArr = arr.Copy()
            // path.forEach(xy => logArr.set(xy, BgRed + 'O' + Reset))
            // logArr.Log()

            const posStr = pos.toString()

            const j = connections.get(posStr) ?? new Map<string, number>()

            j.set(lastJunctionStr, weight + 1)
            connections.get(lastJunctionStr)!.set(posStr, weight + 1)

            if (connections.has(posStr)) {
                continue
            }

            connections.set(posStr, j)

            options.forEach(([npos, _]) => {
                if (npos.plus(dir).EQ(pos)) return

                Q.push([npos, npos.minus(pos), 0, posStr, path.concat(pos)])
            })
        }
    }

    // console.dir(connections.get('1,0'))
    connections.Log()
}


let max = 0

// [junctionStr, weight, path]
const Q: [string, number, Set<string>, string[]][] = [
    [startPosStr, 0, new Set<string>(), []]
]

while(Q.length > 0) {
    const [junctionStr, weight, path, pathStr] = Q.pop()!

    if (junctionStr === destPosStr) {
        if (weight > max) {
            console.log('found path', weight)
            if (weight > 6300) {
                pathStr.Log()
            }
            max = weight
        }
        continue
    }

    const neighbors = connections.get(junctionStr)!

    neighbors.forEach((w, j) => {
        if (!path.has(j)) {
            const nPath = path.Copy()
            nPath.add(junctionStr)
            Q.push([j, weight + w, nPath, pathStr.concat(junctionStr)])
        }
    })
};

(max - 1).Log()