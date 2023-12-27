import { Array2D, XY } from "../Glib/XY"
import { Data } from "../main"


// const loop = Data.map(v => 
//     v.split(' ').Run(
//         d => d === 'R' ? XY.Right : d === 'L' ? XY.Left : d === 'U' ? XY.Down : XY.Up,
//         d => d.toInt())
//     )

const loop = Data.map(v =>
    [v.split(' ')[2].slice(2, -1)].Run(
        n => ({ '0': XY.Right, '1': XY.Up, '2': XY.Left, '3': XY.Down }[n.at(-1)!]!),
        n => n.slice(0,5).toInt(16),)
).Log()

        
let sum = 0

const logShape = (loop: [XY,number][]) => {
    
    const path = []
    let pos = new XY
    for (let i = 0; i < loop.length; i++)
        for (let j = 0; j < loop[i][1]; j++) {
            pos.plusEQ(loop[i][0])
            path.push(pos.Copy())
        }

    let minXY = new XY(Number.MAX_VALUE)
    let maxXY = new XY(Number.MIN_VALUE)

    path.forEach(xy => {
        if (xy.X < minXY.X) minXY.X = xy.X
        if (xy.Y < minXY.Y) minXY.Y = xy.Y
        if (xy.X > maxXY.X) maxXY.X = xy.X
        if (xy.Y > maxXY.Y) maxXY.Y = xy.Y
    })
    const arr = new Array2D<boolean>(maxXY.minus(minXY).plus(2), false)

    path.forEach(xy =>
        arr.set(xy.minus(minXY), true)
    )
    // sum.Log()
    arr.Log()

}
while (loop.length > 4) {
    const bumps: [[[XY, number], [XY, number], [XY, number]], number][] = []
    // logShape(loop)

    //find bumps
    for (let i = 0; i < loop.length; i++) {
        const [a, b, c] = [loop[i], loop[(i + 1) % loop.length], loop[(i + 2)% loop.length]]
        if (!(a[0] === b[0].RotateCW() && a[0] === c[0].RotateCW().RotateCW())) continue
        //bump
        //find greater
        if (a[1] > c[1] || a[1] === c[1]) {
            bumps.push([[a, b, c], (b[1] + 1) * c[1]])
        }
        else /* if (a[1] < c[1]) */ {
            bumps.push([[c, b, a], (b[1] + 1) * a[1]])
        }
    }
    // bumps.Log()

    //find smallest
    let sbump = bumps[0]
    for (let i = 0; i < bumps.length; i++) {
        if (bumps[i][1] < sbump[1])
            sbump = bumps[i]
    }

    // sbump.Log()

    const [[a,b,c], area] = sbump

    sum += area

    // sum.Log()

    if (a[1] === c[1]) {
        loop.splice(loop.indexOf(a), 1)
        loop.splice(loop.indexOf(c), 1)
    }
    else {
        a[1] -= c[1]
        loop.splice(loop.indexOf(c), 1)
    }

    

    for (let i = 0; i < loop.length - 1;) {
        if (loop[i][0] === loop[i+1][0]) {
            loop[i][1] += loop[i+1][1]
            loop.splice(i+1, 1)
        }
        else i++
    }
    
}
//add final square
sum += (loop[0][1] + 1) * (loop[1][1] + 1)

// logShape(loop)
sum.Log()