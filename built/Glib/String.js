"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const Console = __importStar(require("./Console"));
String.prototype.forEach = function (lambda) {
    this.toArray().forEach((v, i) => lambda(v, i));
};
String.prototype.toIntList = function (delim = '\n', radix) {
    return this.split(delim).map(n => parseInt(n.trim(), radix));
};
String.prototype.toFloatList = function (delim = '\n') {
    return this.split(delim).map(n => parseFloat(n));
};
String.prototype.toInt = function (radix) {
    const int = parseInt(this.valueOf(), radix);
    if (isNaN(int))
        throw new Error('String: \'' + this + '\' is not a number');
    return int;
};
String.prototype.toFloat = function () {
    const float = parseFloat(this.valueOf());
    if (isNaN(float))
        throw new Error('String: \'' + this + '\' is not a float');
    return float;
};
String.prototype.toNumsArray = function () {
    const nums = [];
    let numI = 0;
    let isNumber = false;
    for (let i = 0; i < this.length; i++) {
        const code = this.charCodeAt(i);
        if (code >= 48 && code <= 57) {
            //digit
            if (!isNumber) {
                nums[numI] = '';
            }
            isNumber = true;
            nums[numI] += this.charAt(i);
        }
        else {
            if (isNumber) {
                isNumber = false;
                numI++;
            }
        }
    }
    return nums.toIntArray();
};
String.prototype.toArray = function (includeNewlines = true) {
    if (!includeNewlines) {
        return [...this].filter(v => {
            return v !== '\n';
        });
    }
    return [...this];
};
String.prototype.in = function (str) {
    return str.includes(this.valueOf());
};
String.prototype.SplitLines = function () {
    return this.valueOf().split('\n').map(s => s.replaceAll('\r', ''));
};
String.prototype.Split2Lines = function () {
    return this.valueOf().split('\n\n').map(s => s.replaceAll('\r', ''));
};
String.prototype.RegexTest = function (regex) {
    return regex.test(this.valueOf());
};
String.prototype.ReplaceMap = function (map) {
    let string = this.valueOf();
    Object.entries(map).forEach(keyval => {
        string = string.replaceAll(keyval[0], keyval[1]);
    });
    return string;
};
String.prototype.RemoveChars = function (chars) {
    let string = this.valueOf();
    chars.forEach(char => {
        string = string.replaceAll(char, '');
    });
    return string;
};
String.prototype.IsAllCapital = function () {
    return this.toArray().every(char => char === char.toUpperCase());
};
String.prototype.AsColor = function (color) {
    return color + this + Console.Reset;
};
String.prototype.Log = function (color) {
    console.log(color ?? '' + this + Console.Reset);
    return this.valueOf();
};
