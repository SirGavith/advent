import { Array2D, XY } from "../Glib/XY";
import { DataFull } from "../main";


const [arr, moves] =  DataFull.Split2Lines().Run(
    a => Array2D.fromString(a.ReplaceMap({'#' : '##', 'O': '[]', '.' : '..', '@' : '@.'})).Log(),
    b => b.RemoveChars(['\n']).toArray().map(s => s === 'v' ? XY.South : s === '<' ? XY.West : s === '^' ? XY.North : XY.East))

const robot = arr.Find('@')!

moves.forEach((dir, i) => {
    const movers = [robot]
    let canMove = false

    for (let i = 1;;i++) {
        const xy = robot.plus(dir.times(i))
        const s = arr.get(xy)
        if (dir === XY.East || dir === XY.West) {
            if (s === '[' || s === ']') movers.push(xy)
            else if (s === undefined) {
                canMove = true
                break
            }
            else break
        }
        else {
            // N / S

            function addAbove(xy: XY) {
                const s = arr.get(xy)
                if (s === '[') {
                    movers.push(xy)
                    movers.push(xy.plus(XY.East))
                }
                else if (s === ']') {
                    movers.push(xy)
                    movers.push(xy.plus(XY.West))
                }
            }

            addAbove(xy)


            else if (s === undefined) {
                canMove = true
                break
            }
            else break

        }


    }
    if (canMove) {
        movers.forEachReversed(xy => {
            arr.set(xy.plus(dir), arr.get(xy))
        })
        arr.set(robot, undefined)
        robot.plusEQ(dir)
    }

    // console.log(i, dir)
    // arr.Log()
})

arr.Log()
arr.Entries().Accumulate(([xy, str]) => str === 'O' ? xy.Y * 100 + xy.X : 0).Log()