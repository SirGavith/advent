import { n2 } from "../Glib/Array";
import { Data } from "../main";


let stones = new Map<num, num>(Data[0].toIntList(' ').Log().map(n => [n, 1] as n2)).Log()

for (let t = 0; t < 75; t++) {
    stones = stones.toArray().reduce((newstones, [s, count]) => {
        const nd = s.NumDigits()
        
        if (s === 0) {
            newstones.Increment(1, count)
        }
        else if (nd % 2 == 0) {
            const mod = 10 ** (nd/2)
            const si = s % mod
            
            newstones.Increment(si, count)
            newstones.Increment((s - si) / mod, count)
        }
        else {
            newstones.Increment(s * 2024, count)
        }
        return newstones
        
    }, new Map<num, num>())
}

stones.Log().toArray().Accumulate(([_, count]) => count).Log()