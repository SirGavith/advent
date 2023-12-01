"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Day1 = void 0;
const UseExample = false;
const Filer_1 = require("../Glib/Filer");
const Data = Filer_1.Filer.ReadAllLines(UseExample ? '../../data/example.txt' : '../../data/input.txt'), DataFull = Filer_1.Filer.ReadFile(UseExample ? '../../data/example.txt' : '../../data/input.txt');
function Day1() {
    Data.toIntArray().map(n => {
        let fuel = 0;
        let nextf = n;
        while (true) {
            nextf = Math.floor(nextf / 3) - 2;
            if (nextf <= 0)
                break;
            fuel += nextf;
        }
        return fuel;
    }).Sum().Log();
}
exports.Day1 = Day1;
