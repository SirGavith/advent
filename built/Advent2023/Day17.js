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
Object.defineProperty(exports, "__esModule", { value: true });
const XY_1 = require("../Glib/XY");
const Console = __importStar(require("../Glib/Console"));
const main_1 = require("../main");
const arr = XY_1.Array2D.fromString(main_1.DataFull);
const minHeats = arr.map(_ => ({
    // heats: {
    '0,1': [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE],
    '1,0': [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE],
    '0,-1': [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE],
    '-1,0': [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE],
    // }
}));
minHeats.set(XY_1.XY.Zero, {
    // heats: {
    '0,1': [0, 0, 0],
    '1,0': [0, 0, 0],
    '0,-1': [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE],
    '-1,0': [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE],
    // }
});
arr.set(XY_1.XY.Zero, '0');
const stack = [{
        pos: XY_1.XY.Zero,
        minHeat: 0,
        dir: XY_1.XY.Zero,
        length: 5,
        path: []
    }];
while (stack.length > 0) {
    //find least-valued leaf
    const node = stack.pop();
    const addHeat = arr.get(node.pos)?.toInt();
    if (addHeat === undefined)
        continue;
    if (node.length !== 5) {
        const heats = minHeats.get(node.pos);
        const d = node.dir.toString();
        //set visited & min heat
        if (heats[d][node.length] < Number.MAX_SAFE_INTEGER)
            continue;
        if (heats[d][node.length] > node.minHeat) {
            for (let i = node.length; i < 3; i++)
                heats[d][i] = node.minHeat;
        }
    }
    //END CASE
    if (node.pos.EQ(arr.Size.minus(1))) {
        console.log(`Found end node`, node, node.minHeat + addHeat);
        arr.map((c, xy) => (node.path.some(pxy => xy.EQ(pxy)) ? Console.BgRed : '') + c + Console.BgBlack).Log();
        break;
    }
    //STRAIGHT
    if (node.length < 2) {
        stack.push({
            pos: node.pos.plus(node.dir),
            minHeat: node.minHeat + addHeat,
            dir: node.dir,
            length: node.length + 1,
            path: node.path.CopyFast().Push(node.pos)
        });
    }
    //TURNS
    if (node.dir !== XY_1.XY.Right && node.dir !== XY_1.XY.Left) {
        stack.push({
            pos: node.pos.plus(XY_1.XY.Right),
            minHeat: node.minHeat + addHeat,
            dir: XY_1.XY.Right,
            length: 0,
            path: node.path.CopyFast().Push(node.pos)
        });
        stack.push({
            pos: node.pos.plus(XY_1.XY.Left),
            minHeat: node.minHeat + addHeat,
            dir: XY_1.XY.Left,
            length: 0,
            path: node.path.CopyFast().Push(node.pos)
        });
    }
    if (node.dir !== XY_1.XY.Up && node.dir !== XY_1.XY.Down) {
        stack.push({
            pos: node.pos.plus(XY_1.XY.Up),
            minHeat: node.minHeat + addHeat,
            dir: XY_1.XY.Up,
            length: 0,
            path: node.path.CopyFast().Push(node.pos)
        });
        stack.push({
            pos: node.pos.plus(XY_1.XY.Down),
            minHeat: node.minHeat + addHeat,
            dir: XY_1.XY.Down,
            length: 0,
            path: node.path.CopyFast().Push(node.pos)
        });
    }
    stack.sort((a, b) => b.minHeat - a.minHeat);
}
