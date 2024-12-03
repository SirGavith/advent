import { Sorts } from "../Glib/Sort"
import { Data } from "../main"

const [A, B] = Data.map(r => r.split('   ')).Transpose2D()
.map(a => a.toIntArray().Sort(Sorts.LeastFirst))

//part 1
A.map((x, i) => Math.abs(x - B[i])).Sum().Log()

//part 2
const m = B.FrequencyMap()
A.map(x => x * (m.get(x) ?? 0)).Sum().Log()