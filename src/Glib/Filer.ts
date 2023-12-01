import fs from 'fs'
import path from 'path'

export class Filer {
    static ReadFile(localpath: string): string {
        return Filer.ReadAllLines(localpath).join('\n')
    }
    static ReadAllLines(localpath: string): string[] {
        let lines = (fs.readFileSync(localpath, 'utf8') as string)
            .replaceAll('\r', '')
            .SplitLines()
            .filter(l => !l.startsWith('//'))
            // .map(l => l.trim())
        if (lines.at(-1) === '') lines = lines.slice(0, -1)
        return lines
    }
    static WriteFile(localpath: string, data: string | Uint8Array) {
        fs.writeFile(localpath, data, err => { if (err) console.log(err) })
    }
}