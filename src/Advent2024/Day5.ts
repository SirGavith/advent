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

l.SplitLines().map(l => l.split(',')).Log()
.filter(pages => {
    for (let i = 0; i < pages.length; i++) {
        for (let j = 0; j < i; j++) {
            const r = rules.get(pages[i])
            if (r?.has(pages[j])) return true
        }
    }
    return false
})
.map(pages => {
    for (let i = 0; i < pages.length; i++) {
        for (let j = 0; j < i; j++) {
            const r = rules.get(pages[i])
            if (r?.has(pages[j])) {
                const temp = pages[i]
                pages[i] = pages[j]
                pages[j] = temp
            }
        }
    }
    return pages
})
.Log()
.map(pages => pages[(pages.length - 1) / 2])
.toIntArray()
.Sum().Log()