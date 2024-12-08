import { Data } from "../main";

// Data.map(l => {
//     const s = l.matchAll(/mul\((\d+),(\d+)\)/g)
//     return [...s].map(x => x.slice(1).toIntArray().Product().Log()).Sum()
// }).Log().Sum().Log()


[...Data.join('').matchAll(/(?:(mul)\((\d+),(\d+)\))|(?:(do)\(\))|(?:(don't)\(\))/g)]
    .reduce(([sum, on], match) => [
    match[1] === 'mul' && on ? sum + match.slice(2, 4).toIntArray().Product() : sum,
    match[4] === 'do' ? true : match[5] === 'don\'t' ? false : on] as [number, boolean]
, [0, true] as [number, boolean]).Log()
