import { Array2D, XY } from "../Glib/XY";
import { DataFull } from "../main";


const arr = Array2D.fromString(DataFull).Log()


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
    
    while (unvisited.size > 0) {
        const [nxystr] = unvisited
        unvisited.delete(nxystr)
        unfilledgrid.delete(nxystr)
        plants.add(nxystr)
        const nxy = XY.fromString(nxystr)
        
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

    for (let x = 0; x <= arr.Size.X; x++) {
        //find num of sides at x=x
        let onEdge = false
        let isLeft = false

        for (let y = 0; y < arr.Size.Y; y++) {
            const l = plants.has(new XY(x - 1, y).toString())
            const r = plants.has(new XY(x, y).toString())

            const exactlyOneInPlants = (l && !r) || (!l && r)

            if (onEdge && (!exactlyOneInPlants || (!l === isLeft))) {
                //neither or both are name; so end edge.
                //Alternatively, we switch what side the edge is on, so end edge and we will start another
                onEdge = false
                sides++
            }
            
            if (exactlyOneInPlants) {
                onEdge = true
                isLeft = l
            }
        }

        if (onEdge) sides++
    }

    // console.log('vertsides', sides)

    for (let y = 0; y <= arr.Size.Y; y++) {
        //find num of sides at y=y
        let onEdge = false
        let isLeft = false
        
        for (let x = 0; x < arr.Size.X; x++) {
            const t = plants.has(new XY(x, y - 1).toString())
            const b = plants.has(new XY(x, y).toString())

            const exactlyOneInPlants = (t && !b) || (!t && b)

            if (onEdge && (!exactlyOneInPlants || (!t === isLeft))) {
                //neither or both are name; so end edge.
                //Alternatively, we switch what side the edge is on, so end edge and we will start another
                onEdge = false
                sides++
            }

            if (exactlyOneInPlants) {
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