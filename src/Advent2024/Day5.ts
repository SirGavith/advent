import { Data, DataFull } from "../main";

const [m, l]  = DataFull.Split2Lines()

const rules = new Map<string, Set<string>>()

m.SplitLines().map(l => l.split('|') as [string, string]).forEach(([p1, p2]) => {
    if (rules.has(p1))
        rules.get(p1)!.add(p2)
    else
        rules.set(p1, new Set([p2]))
})

rules.Log()


l.SplitLines().map(l => l.split(','))
.filter(pages => {

    for (let i = 0; i < pages.length - 1; i++) {
        if (rules.has(pages[i])) {
            for (let j = i + 1; j < pages.length; j++) {

            }
        }
    }
})
.map(pages => pages[(pages.length - 1) / 2])
.Sum().Log()