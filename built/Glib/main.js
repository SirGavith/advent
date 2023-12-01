"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Glib = void 0;
class Glib {
    static init() {
        require('./Array');
        require('./Bigint');
        require('./Boolean');
        require('./Generator');
        require('./Number');
        require('./Object');
        require('./String');
    }
}
exports.Glib = Glib;
