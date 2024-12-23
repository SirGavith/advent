import { Array2D, XY } from "../Glib/XY";
import { DataFull } from "../main";


const arr = Array2D.fromString(DataFull)


const unfilledgrid = new Set(arr.Size.minus(1).Combinations().map(c => c.toString()))

let price = 0

while (unfilledgrid.size > 0) {
    const [xystr] = unfilledgrid
    unfilledgrid.delete(xystr)
    const xy = XY.fromString(xystr)
    const name = arr.get(xy)
    
    const unvisited = new Set<string>([xystr])
    const plants = new Set<string>()
    let edges = 0

    const minXY = new XY, maxXY = new XY
    
    while (unvisited.size > 0) {
        const [nxystr] = unvisited
        unvisited.delete(nxystr)
        unfilledgrid.delete(nxystr)
        plants.add(nxystr)
        const nxy = XY.fromString(nxystr)

        if (nxy.X < minXY.X) minXY.X = nxy.X
        if (nxy.Y < minXY.Y) minXY.Y = nxy.Y
        if (nxy.X > maxXY.X) maxXY.X = nxy.X
        if (nxy.Y > maxXY.Y) maxXY.Y = nxy.Y

        let nedges = 0
        
        arr.Neighbours(nxy).forEach(([nnxy, nnname]) => {
            if (nnname === name) {
                const nnxystr = nnxy.toString()
                nedges++
                if (plants.has(nnxystr)) return
                unvisited.add(nnxystr)
            }
        })
        
        edges += 4 - nedges
    }

    let sides = 0

    for (let x = minXY.X; x <= maxXY.X + 1; x++) {
        //find num of sides at x=x
        let onEdge = false
        let isLeft = false

        for (let y = minXY.Y; y < maxXY.Y + 1; y++) {
            const l = plants.has(new XY(x - 1, y).toString())
            const r = plants.has(new XY(x, y).toString())

            if (onEdge && (r === l || (!l === isLeft))) {
                //neither or both are name; so end edge.
                //Alternatively, we switch what side the edge is on, so end edge and we will start another
                onEdge = false
                sides++
            }
            
            if (r !== l) {
                onEdge = true
                isLeft = l
            }
        }

        if (onEdge) sides++
    }

    // console.log('vertsides', sides)

    for (let y = minXY.Y; y <= maxXY.Y + 1; y++) {
        //find num of sides at y=y
        let onEdge = false
        let isLeft = false
        
        for (let x = minXY.X; x < maxXY.X + 1; x++) {
            const t = plants.has(x + ',' + (y - 1))
            const b = plants.has(x + ',' + y)

            if (onEdge && (t === b || (!t === isLeft))) {
                //neither or both are name; so end edge.
                //Alternatively, we switch what side the edge is on, so end edge and we will start another
                onEdge = false
                sides++
            }

            if (t !== b) {
                onEdge = true
                isLeft = t
            }
        }

        if (onEdge) sides++
    }

    // console.log(name, xy, 'sides:', sides, 'price', sides * plants.size)
    price += sides * plants.size
}

price.Log()