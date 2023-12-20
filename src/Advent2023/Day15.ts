import { Data } from "../main";

//part 1
Data[0].split(',').map(l => 
    l.toArray().reduce((val, c) => ((val + c.charCodeAt(0)) * 17) % 256, 0)
).Sum().Log()

// part 2

const boxes: Array<[string, number]>[] = Array(256).fill(0).map(_ => [])

Data[0].split(',').forEach(l => {
    let [name, focalLen] = l.split(/[=-]/).Run(a => a, b => b === '' ? 0 : b.toInt())

    const box = boxes[name.toArray().reduce((val, c) => ((val + c.charCodeAt(0)) * 17) % 256, 0)]
    const i = box.findIndex(l => l[0] === name)

    if (l.endsWith('-') && i !== -1) {  
        box.splice(i, 1)
    }
    else if (l.includes('=')) {
        if (i !== -1) box[i] = [name, focalLen]
        else box.push([name, focalLen])
    }
})

boxes.reduce((power, b, bi) => 
    b.reduce((p, l, li) => 
        p + ((bi + 1) * (li + 1) * l[1])
    , power)
, 0).Log()