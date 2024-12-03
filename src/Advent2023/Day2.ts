import { Data } from "../main"

// //my part 1
// const maxR = 12
// const maxG = 13
// const maxB = 14

// Data.map((l,i) => {
//     const r = l.split(': ')[1].split('; ').some(s => 
//         s.split(', ')
//         .some(g => {
//             const a = g.split(' ')
//             return a[1] === 'red' && a[0].toInt() > maxR ||
//                 a[1] === 'green' && a[0].toInt() > maxG ||
//                 a[1] === 'blue' && a[0].toInt() > maxB
//         })
//     )
//     return r ? 0 : i+1
// }).Sum()



// //my part 2
// Data.map(l => {
//     let minR = 0
//     let minG = 0
//     let minB = 0
//     //for each game
//     l.split(': ')[1].split('; ').forEach(s =>
//         s.split(', ').forEach(g => {
//             const a = g.split(' ')
//             if (a[1] === 'red') minR = Math.max(minR, a[0].toInt())
//             if (a[1] === 'green') minG = Math.max(minG, a[0].toInt())
//             if (a[1] === 'blue') minB = Math.max(minB, a[0].toInt())
//         })
//     )
//     // console.log(minR, minG, minB)
//     return minR * minG * minB
// }).Sum()


//condensed part 2
Data.reduce((sum, l) =>  {
    const mins: {[key:string]:number} = { 'red': 0, 'green': 0 , 'blue': 0 }

    l.split(': ')[1].split('; ').forEach(s => {
        s.split(', ').forEach(g => {
            const [x, y] = g.split(' ')
            const b = x.toInt()
            if (b > mins[y]) mins[y] = b
            // return mins
        })
    })

    return sum + mins.Values().Product()
}, 0).Log()