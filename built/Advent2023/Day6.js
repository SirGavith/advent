"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
//part 1
main_1.Data.map(l => l.split(/\s+/g).slice(1).toIntArray()).Transpose2D()
    .map(([time, record]) => (0.5 * (time + Math.sqrt(time ** 2 - 4 * record)) - 0.000001).Floor() -
    (0.5 * (time - Math.sqrt(time ** 2 - 4 * record)) + 0.000001).Ceil() + 1).Product().Log();
//part 2
const [time, record] = main_1.Data.map(l => l.slice(11).RemoveChars([' ']).toInt());
const b = 0.5 * (time + Math.sqrt(time ** 2 - 4 * record));
const a = 0.5 * (time - Math.sqrt(time ** 2 - 4 * record));
console.log((b - 0.000001).Floor() - (a + 0.000001).Ceil() + 1);
