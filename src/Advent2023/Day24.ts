import { XY } from "../Glib/XY";
import { Data } from "../main";

const hail = Data.map(l =>
    l.replaceAll(' ', '').split('@').map(xyz =>
        XY.fromString(xyz.split(',').slice(0, 2).join(','))))

const lowerBound = 200000000000000
const upperBound = 400000000000000

let count = 0

hail.forEachPair(([[A, vA], [B, vB]]) => {
    const mA = vA.Y / vA.X
    const mB = vB.Y / vB.X

    const x = (A.Y - B.Y - mA * A.X + mB * B.X) / (mB - mA)
    const y = ((A.X - B.X) * mA * mB + mA * B.Y - mB * A.Y) / (mA - mB)

    if ((vA.X < 0 && x > A.X) ||
        (vB.X < 0 && x > B.X) || 
        (vA.X > 0 && x < A.X) ||
        (vB.X > 0 && x < B.X)
        ) { return }

    if (lowerBound <= x && upperBound >= x && lowerBound <= y && upperBound >= y) {
        // console.log('valid')
        count++
    }
}, false, false, false)

count.Log()