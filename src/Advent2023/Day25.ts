import { Data } from "../main";

const m = new Map(Data.map(l => l.split(': ').Run(a => a, b => [new Map(b.split(' ').map(a => [a, 1] as [string, number])), 1] as [Map<string, number>, number])))

m.forEach((neighbors, component) => {
    neighbors[0].forEach((_, v) => {
        if (m.has(v)) m.get(v)![0].set(component, 1)
        else m.set(v, [new Map([[component, 1]]), 1])
    })
})
const originalSize = m.size.Log()
const a = m.keys().next().value.Log() as string
// const allNodes = new Set(m.toArray().map(([k]) => k))
// allNodes.Log()

m.Log()

//weight, size of first block; block2.size = allNodes.size - block1.size

//Stoer-Wagner algorithm

// let i = m.size
for (let i = m.size; i > 1; i--) {
    console.log(i)
    
    let supernode = new Set([a])
    let prevNode = a
    // let cutWeight: number

    while (supernode.size !== i - 1) {
        // console.log('supernode', supernode)

        // 'natural way'; find adjacent node to the supernode with maximum weight
        // const adjacentWeights = supernode.toArray().map(node => m.get(node)!).Log()

        const aWeights = new Map<string, number>()
        
        
        supernode.forEach(node => m.get(node)![0].forEach((w, n) => {
            if (supernode.has(n)) return
            const currentW = aWeights.get(n)
            if (currentW !== undefined)
                aWeights.set(n, currentW + w)
            else aWeights.set(n, w)
        }))

        let mostAdjacentNode: string | null = null, weight = 0

        aWeights.forEach((w, n) => {
            if (w > weight) {
                weight = w
                mostAdjacentNode = n
            }
        })

        prevNode = mostAdjacentNode!
        supernode.add(mostAdjacentNode!)

        // console.log('adding', mostAdjacentNode)
    }
    let finalNode: string; // = allNodes.difference(superNode); not yet supported :(
        m.forEach((_, node) => { if (!supernode.has(node)) finalNode = node })
    if (!finalNode!) throw new Error

    let cutWeight = m.get(finalNode)![0].Values().Sum()

    console.log('finalNode', finalNode, 'prevNode', prevNode, 'cutWeight', cutWeight)
    if (cutWeight === 3) {
        //IF WRONG BC SUPERNODE HAS MERGERS
        console.log(m.get(finalNode)![1], originalSize - m.get(finalNode)![1], m.get(finalNode)![1] * (originalSize - m.get(finalNode)![1]))
        break
    }

    console.log('merging', finalNode, 'into', prevNode)

    //remove finalNode
    //merge prevNode and finalNode
    const p = m.get(prevNode)!
    p[0].delete(finalNode)
    p[1] += m.get(finalNode)![1]
    
    m.get(finalNode)![0].forEach((w, neighbor) => {
        // copy finalNode neighbors and weights to prevNode
        if (neighbor !== prevNode) p[0].set(neighbor, (p[0].get(neighbor) ?? 0) + w)
    })

    m.delete(finalNode)

    m.forEach((map, node) => {
        if (node === prevNode) return 
        if (map[0].has(finalNode)) {
            map[0].set(prevNode, (map[0].get(prevNode) ?? 0) + map[0].get(finalNode)!)
            map[0].delete(finalNode)
        }
    })

    m.Log()
}