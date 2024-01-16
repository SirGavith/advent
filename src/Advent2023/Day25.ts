import { Data } from "../main";

const m = new Map<string, [Map<string, number>, number]>()

Data.forEach(line => {
    const [name, neighbors] = line.split(': ')

    let neighborsMap = m.get(name)
    if (neighborsMap === undefined) {
        neighborsMap = [new Map<string, number>(), 1] as const
        m.set(name, neighborsMap)
    }

    neighbors.split(' ').forEach(n => {
        neighborsMap![0].set(n, 1)
        const currentNeighborNeighbors = m.get(n)
        if (currentNeighborNeighbors !== undefined) 
            currentNeighborNeighbors[0].set(name, 1)
        else m.set(n, [new Map([[name, 1]]), 1])
    })
})

const originalSize = m.size
const a = m.keys().next().value as string

// Stoer-Wagner  min-cut algorithm
// we know min cut is three, so break as soon as we see that
// in each step, the algorithm makes two blocks: the supernode, and the rest, which are merged together.
// in each step, the supernode is all nodes but 2, and those two get merged.
// to make the supernode, start with any node A, and then repeatedly add the most adjacent node
// the most adjacent node is the node which has the heighest summed weight to all nodes in the supernode

// https://www.youtube.com/watch?v=AtkEpr7dsW4

// let i = m.size
for (let i = m.size; i > 1; i--) {
    let supernode = new Set([a])
    let supernodeNeighbors = m.get(a)![0].Copy()
    let prevNode = a
 
    while (supernode.size < i - 1) {
        // 'natural way'; find adjacent node to the supernode with maximum weight
        
        let mostAdjacentNode: string | null = null,
            weight = 0

        supernodeNeighbors.forEach((w, n) => {
            if (w > weight) {
                weight = w
                mostAdjacentNode = n
            }
        })

        prevNode = mostAdjacentNode!
        supernode.add(mostAdjacentNode!)

        supernodeNeighbors.delete(mostAdjacentNode!)

        m.get(mostAdjacentNode!)![0].forEach((w, n) => {
            if (!supernode.has(n))
                supernodeNeighbors.set(n, (supernodeNeighbors.get(n) ?? 0) + w)
        })
    }

    const [finalNode, cutWeight] = supernodeNeighbors.entries().next().value as [string, number]

    if (cutWeight === 3) {
        console.log(m.get(finalNode)![1] * (originalSize - m.get(finalNode)![1]))
        break
    }

    //remove finalNode
    //merge prevNode and finalNode

    const p = m.get(prevNode)!
    const f = m.get(finalNode)!

    p[0].delete(finalNode)
    p[1] += f[1]
    
    f[0].forEach((w, neighbor) => {
        // copy finalNode neighbors and weights to prevNode
        if (neighbor === prevNode) return

        m.get(prevNode)![0].set(neighbor, (p[0].get(neighbor) ?? 0) + w)
        m.get(neighbor)![0].set(prevNode, ((m.get(neighbor)![0].get(prevNode) ?? 0) + w))
        m.get(neighbor)![0].delete(finalNode)
    })

    m.delete(finalNode)
}