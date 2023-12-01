"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFull = exports.Data = void 0;
const fs = __importStar(require("fs"));
const main_1 = require("./Glib/main");
const path_1 = __importDefault(require("path"));
const Filer_1 = require("./Glib/Filer");
main_1.Glib.init();
const year = '2023';
const p = 'C:/Users/gavin/Documents/Code/advent/src/Advent' + year;
const recentFile = fs.readdirSync(p)
    .map(file => ({ name: file, timestamp: fs.statSync(path_1.default.join(p, file)).mtimeMs }))
    .sort((a, b) => b.timestamp - a.timestamp)[0].name.slice(0, -3);
const UseExample = process.argv[2] == 'example';
exports.Data = Filer_1.Filer.ReadAllLines(UseExample ? './data/example.txt' : './data/input.txt'), exports.DataFull = Filer_1.Filer.ReadFile(UseExample ? './data/example.txt' : './data/input.txt');
console.log('Loading', recentFile);
console.log();
const startTime = process.hrtime();
require(`./Advent` + year + `/` + recentFile);
const time = process.hrtime(startTime);
console.log();
console.log(`Ran in ${time[0]}s ${time[1] / 10 ** 6}ms`);
