import { Data } from "../main";

Data.map(eq => eq.split(': ').Run(a => a.toInt(), b => b.toIntList(' ')) as [num, num[]])
.Accumulate(([ans, seq]) => {

    function canMakeAns(soFar: num, i: num): boolean {
        if (seq.length === i) return ans === soFar
        const n = seq[i]
        return canMakeAns(soFar + n, i + 1) ||
            canMakeAns(soFar * n, i + 1) ||
            canMakeAns(soFar * Math.pow(10, n.NumDigits()) + n, i + 1) //comment out this line for part 1
    }
    
    return canMakeAns(1, 0) ? ans : 0
}).Log()