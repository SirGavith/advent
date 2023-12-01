"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpsGetJSON = exports.httpsGet = void 0;
const https_1 = __importDefault(require("https"));
function httpsGet(url, callback, errorCallback) {
    const req = https_1.default.request(url, res => res.on('data', callback));
    req.on('error', errorCallback ?? (e => console.error(e)));
    req.end();
}
exports.httpsGet = httpsGet;
function httpsGetJSON(url, callback, errorCallback) {
    httpsGet(url, d => callback(JSON.parse(d.toString())), errorCallback);
}
exports.httpsGetJSON = httpsGetJSON;
