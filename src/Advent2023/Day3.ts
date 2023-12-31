import { Array2D, XY } from "../Glib/XY";
import { Data } from "../main";


const digits = '0123456789'

//part 1
const symbols = '@#$%&*+-=/'
let sum = 0
Array2D.fromArray(Data.map(r => r.toArray())).forEach((val,xy, a) => {
    if (val?.in(symbols)) {
        //symbol
        a.Neighbours(xy, true).forEach(([nxy, n]) => {
            if (n !== '.') {
                // a.Log()
                //read whole number

                //find while number & replace with .

                const row = a.getRow(nxy.Y)

                let i = nxy.X
                for (; i >= 0; i--) {
                    if (!row.at(i - 1)?.in(digits)) {
                        break
                    }
                }

                let j = nxy.X
                for (; j < row.length; j++) {
                    if (!row.at(j)?.in(digits)) break
                }
                
                // console.log(n, i, j)

                const str = row.slice(i,j).join('').Log()

                if (str !== '')
                    sum += str.toInt()
                
                for (let k = i; k < j; k++) {
                    a.set(new XY(k,nxy.Y), '.')
                }
                

            }
        })
    }
})
sum.Log()


//part 2
Array2D.fromArray(Data.map(r => r.toArray())).reduce((sum, val, xy, a) => {
    if (val !== '*') return sum
    const adjacents: number[] = []

    a.Neighbours(xy, true).forEach(([nxy, n]) => {
        if (n === '.') return
        //find whole number and replace with .

        const row = a.getRow(nxy.Y)

        let i = nxy.X,
            j = nxy.X

        while (i >= 0 && row.at(i - 1)?.in(digits)) i--
        while (j < row.length && row.at(j)?.in(digits)) j++

        if (i !== j)
            adjacents.push(row.slice(i, j).join('').toInt())

        for (let k = i; k < j; k++) 
            a.set(new XY(k, nxy.Y), '.')
    })
    return sum + (adjacents.length === 2 ? adjacents.Product() : 0)
}, 0).Log()
