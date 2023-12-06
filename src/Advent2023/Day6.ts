import { Data } from "../main";

//part 1
Data.map(l => l.split(/\s+/g).slice(1).toIntArray()).Transpose2D()
    .map(([time,record]) => 
        (0.5 * (time + Math.sqrt(time ** 2 - 4 * record)) - 0.000001).Floor() -
        (0.5 * (time - Math.sqrt(time ** 2 - 4 * record)) + 0.000001).Ceil() + 1
).Product().Log()
 

//part 2
const [time,record] = Data.map(l => l.slice(11).RemoveChars([' ']).toInt())

const b = 0.5 * (time + Math.sqrt(time ** 2 - 4 * record))
const a = 0.5 * (time - Math.sqrt(time ** 2 - 4 * record))

console.log((b - 0.000001).Floor() - (a + 0.000001).Ceil() + 1)