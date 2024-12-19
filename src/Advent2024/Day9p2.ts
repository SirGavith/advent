import { Data } from "../main";

class MemBlock {
    constructor(public Size: number, public Id?: number) {}
}

const memory = Data[0].toArray().toIntArray().Log().map((b, i) => b > 0 ? new MemBlock(b, i % 2 === 0 ? i/2 : undefined): undefined).RemoveUndefined().Log()
const files: MemBlock[] = memory.filter(b => b.Id !== undefined)


files.forEachReversed(f => {
    // f.Log()
    let j = memory.findIndex(a => a === f)

    for (let i = 0; i < j; i++) {
        if (memory[i].Id === undefined && memory[i].Size >= f.Size) {

            memory[j] = new MemBlock(f.Size)
            //merge adjacent empty space
            if (j-1 >= 0 && memory[j - 1].Id === undefined) {
                memory[j - 1].Size += f.Size
                memory.splice(j, 1)
                j--
            }
            if (j + 1 < memory.length && memory[j + 1].Id === undefined) {
                memory[j].Size += memory[j + 1].Size
                memory.splice(j + 1, 1)
            }

            if (memory[i].Size > f.Size) 
                memory.splice(i, 1, f, new MemBlock(memory[i].Size - f.Size, undefined))
            else if (memory[i].Size === f.Size)
                memory[i] = f
            
            break
        }   
    }
    // memory.Log()
    // memory.map(b => (b.Id?.toString() ?? '.').repeat(b.Size)).join('').Log()
})

memory.flatMap(b => new Array<number | undefined>(b.Size).fill(b.Id))
    .map((x, i) => x !== undefined ? x * i : 0).Log().Sum().Log()
