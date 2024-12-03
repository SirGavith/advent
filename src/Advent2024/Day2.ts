import { Data } from "../main";

function isSafe(levels: number[]) {
    if (levels[0] > levels[1]) levels.reverse()
    
    for (let i = 0; i < levels.length - 1; i++) {
        const a = levels[i], b = levels[i + 1]
        if (b <= a || b - a > 3) return false
    }

    return true
}

// part 1
Data.Count(l => {
    const levels = l.toIntList(' ')
    return isSafe(levels)
}).Log()

// part 2
Data.Count(l => {
    const levels = l.toIntList(' ')

    if (isSafe(levels)) return true

    for (let i = 0; i < levels.length; i++) {
        if (isSafe(levels.filter((_, j) => j != i))) return true
    }

    return false
}).Log()