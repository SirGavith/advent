import * as fs from 'fs'
import { Glib } from './Glib/main'
import path from 'path'
import { Filer } from './Glib/Filer'

Glib.init()
const year = '2023'
const p = 'C:/Users/gavin/Documents/Code/advent/src/Advent' + year
const recentFile = fs.readdirSync(p)
    .map(file => ({ name: file, timestamp: fs.statSync(path.join(p, file)).mtimeMs }))
    .sort((a, b) => b.timestamp - a.timestamp)[0].name.slice(0, -3)

const UseExample = process.argv[2] == 'example'

export const Data = Filer.ReadAllLines(UseExample ? './data/example.txt' : './data/input.txt'),
    DataFull = Filer.ReadFile(UseExample ? './data/example.txt' : './data/input.txt')

console.log('Loading', recentFile)    
console.log()

const startTime = process.hrtime();

require(`./Advent` + year + `/` + recentFile)

const time = process.hrtime(startTime)
console.log()
console.log(`Ran in ${time[0]}s ${time[1] / 10 ** 6}ms`)