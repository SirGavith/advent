import { Data } from "../main";

const memo = new Map<string, number>()
Data.map(l => {

    //PART 1
    // const [row, groups] = l.split(' ').Run(
        //     r => r,
        //     g => g.toIntList(','))

    //PART 2
    const [row, groups] = l.split(' ').Run(
        r => Array(5).fill(r).join('?'),
        g => (g + ',').repeat(5).slice(0, -1).toIntList(','))
        
    const recurse = (r: string, g: number[], c = 0): number => {
        let memoKey = r + '|' + g.join(',') + '|' + c
        if (memo.has(memoKey)) return memo.get(memoKey)!
        
        let returnVal = null

        if (r[0] === '.') {
            if (c === g[0])
                returnVal = recurse(r.slice(1), g.slice(1), 0)
            else if (c > 0)
                returnVal = 0
            else 
                returnVal = recurse(r.slice(1), g, 0)
        }
        else if (r[0] === '#') {
            returnVal = recurse(r.slice(1), g, c + 1)
        } 
        else if (r[0] === '?') {
            if (c > g[0])
                returnVal = 0
            else if (c === g[0])
                returnVal =  recurse(r.slice(1), g.slice(1), 0)
            else {
                returnVal = recurse(r.slice(1), g, c + 1)       // #
                returnVal += recurse('.' + r.slice(1), g, c)    // .
            }
        }
        else if (r === '') {
            if (c === 0 && g.length === 0 || c === g[0] && g.length === 1)
                returnVal = 1
            else returnVal = 0
        }

        if (returnVal === null) throw new Error
        memo.set(memoKey, returnVal)
        return returnVal
    }

    let x = recurse(row, groups)
    return x
}).Sum().Log()



// Data.map(l => {
//     const [row,groups] = l.split(' ').Run(
//         r => Array(5).fill(r).join('?').toArray(),
//         g => (g + ',').repeat(5).slice(0,-1).toIntList(10, ','))

//     // const [row, groups] = l.split(' ').Run(
//     //     r => r.toArray(),
//     //     g => g.toIntList(10, ','))

//     const totalUnknown = row.Frequency('?')
//     const numToSet = groups.Sum() - row.Frequency('#')
    
//     console.log(row.join(''), groups, totalUnknown, numToSet)
    
//     const qs: number[] = []
    
//     for (let i = 0; i < row.length; i++) {
//         if (row[i] === '?') qs.push(i)
//     }

//     let count = 0

//     const getGroups = (r: string[], log = true) => {
//         const gs = []
//         let currentLen = 0
//         for (let j = 0; j < r.length; j++) {
//             if (r[j] === '#') currentLen++
//             else if (r[j] === '?') break
//             else {
//                 if (currentLen > 0) {
//                     gs.push(currentLen)
//                     currentLen = 0
//                 }
//             }
//         }
//         if (currentLen > 0) {
//             gs.push(currentLen)
//         }
//         // if (log) console.log(Console.Green, r.join(''), gs, Console.White)
//         return gs
//     }

//     const recurse = (r: string[], depth = 1, start = 0) => {
//         //calc gs up to first ?
//         const Ggg = getGroups(r, false)

//         for (let i = 0; i < Ggg.length - 1; i++) {
//             if (Ggg[i] !== groups[i]) return
//         }
//         if (Ggg[Ggg.length - 1] > groups[Ggg.length - 1]) return


//         for (let i = start; i < totalUnknown - (numToSet - depth); i++) {
//             //let ith ? be set
//             const rr: string[] = []

//             for (let j = 0; j < r.length; j++)
//                 rr[j] = r[j] === '?' && j <= i ? '.' : r[j]

//             //replace all ?s before i with .

//             rr[qs[i]] = '#'

            
//             if (depth < numToSet)
//                 recurse(rr,depth + 1, i + 1)
//             else {
//                 //check if we satisfy req
//                 const gs = getGroups(rr)               
//                 if (gs.every((g,k) => g === groups[k])) {
//                     // console.log(' '.repeat(depth), rr.join(''), gs)
//                     count++
//                 }

//             }

//         }
//     }

//     recurse(row)

//     return count.Log()

// }).Sum().Log()