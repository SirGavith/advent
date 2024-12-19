import { Data } from "../main";

const arr: (number | undefined)[] = []
let len = 0

const inp = Data[0].toArray().toIntArray().Log()

for (let i = 0; i < inp.length; i++) {
    for (let j = 0; j < inp[i]; j++) {
        arr[len] = i / 2
        len++
    }
    len += inp[++i]
}

arr.Log()


for (let n = arr.pop(); true; n = arr.pop()) {
    if (n === undefined) continue
    const i = arr.findIndex(v => v === undefined)
    if (i === -1) {
        arr.push(n)
        break
    }
    arr[i] = n
}

arr.Log().map((x, i) => x! * i).Log().Sum().Log()
