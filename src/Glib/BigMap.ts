export class BigMap<K, V> {
    /*
        public api, compatible with "Map"
    */
    private maps: Map<K, V>[] = []
    private readonly kMaxSize = Math.pow(2, 24)

    constructor (entries?: readonly (readonly [K, V])[] | null) {
        this.maps = [new Map(entries)]
    }

    set (key: K, value: V): void {
        const map = this.maps.at(-1)!

        if (map.size === this.kMaxSize) {
            this.maps.push(new Map)
            this.set(key, value)
        } else {
            map.set(key, value)
        }
    }

    has (key: K) {
        return this.mapForKey(key) !== undefined
    }

    get (key: K) {
        return this.valueForKey(key)
    }

    delete (key: K) {
        const map = this.mapForKey(key)

        if (map !== undefined) {
        return map.delete(key)
        }

        return false
    }

    clear () {
        for (let map of this.maps) {
        map.clear()
        }
    }

    get size () {
        let size = 0

        for (let map of this.maps) {
        size += map.size
        }

        return size
    }

    forEach (callbackFn: (value: K | V | [K, V]) => void) {
        for (let value of this) {
            callbackFn(value)
        }
    }

    entries () {
        return this.iterator('entries')
    }

    keys () {
        return this.iterator('keys')
    }

    values () {
        return this.iterator('values')
    }

    [Symbol.iterator] () {
        return this.iterator(Symbol.iterator)
    }

    private mapForKey (key: K) {
        for (let index = this.maps.length - 1; index >= 0; index--) {
            const map = this.maps[index]

            if (map.has(key)) {
            return map
            }
        }
    }

    private valueForKey (key: K) {
        for (let index = this.maps.length - 1; index >= 0; index--) {
            const map = this.maps[index]
            const value = map.get(key)

            if (value !== undefined) {
            return value
            }
        }
    }

    private iterator (name: 'entries' | 'keys' | 'values' | typeof Symbol.iterator) {
        const items = this.maps
        let index = 0

        var iterator = items[index][name]()

        return {
            next: () => {
            let result = iterator.next()

            if (result.done && index < (items.length - 1)) {
                index++
                iterator = items[index][name]()
                result = iterator.next()
            }

            return result
            },
            [Symbol.iterator]: function () {
                return this
            }
        }
    }
}