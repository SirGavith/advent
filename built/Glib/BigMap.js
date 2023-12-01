"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigMap = void 0;
class BigMap {
    /*
        public api, compatible with "Map"
    */
    maps = [];
    kMaxSize = Math.pow(2, 24);
    constructor(entries) {
        this.maps = [new Map(entries)];
    }
    set(key, value) {
        const map = this.maps.at(-1);
        if (map.size === this.kMaxSize) {
            this.maps.push(new Map);
            this.set(key, value);
        }
        else {
            map.set(key, value);
        }
    }
    has(key) {
        return this.mapForKey(key) !== undefined;
    }
    get(key) {
        return this.valueForKey(key);
    }
    delete(key) {
        const map = this.mapForKey(key);
        if (map !== undefined) {
            return map.delete(key);
        }
        return false;
    }
    clear() {
        for (let map of this.maps) {
            map.clear();
        }
    }
    get size() {
        let size = 0;
        for (let map of this.maps) {
            size += map.size;
        }
        return size;
    }
    forEach(callbackFn) {
        for (let value of this) {
            callbackFn(value);
        }
    }
    entries() {
        return this.iterator('entries');
    }
    keys() {
        return this.iterator('keys');
    }
    values() {
        return this.iterator('values');
    }
    [Symbol.iterator]() {
        return this.iterator(Symbol.iterator);
    }
    mapForKey(key) {
        for (let index = this.maps.length - 1; index >= 0; index--) {
            const map = this.maps[index];
            if (map.has(key)) {
                return map;
            }
        }
    }
    valueForKey(key) {
        for (let index = this.maps.length - 1; index >= 0; index--) {
            const map = this.maps[index];
            const value = map.get(key);
            if (value !== undefined) {
                return value;
            }
        }
    }
    iterator(name) {
        const items = this.maps;
        let index = 0;
        var iterator = items[index][name]();
        return {
            next: () => {
                let result = iterator.next();
                if (result.done && index < (items.length - 1)) {
                    index++;
                    iterator = items[index][name]();
                    result = iterator.next();
                }
                return result;
            },
            [Symbol.iterator]: function () {
                return this;
            }
        };
    }
}
exports.BigMap = BigMap;
