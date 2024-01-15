interface Map<K, V> {
    toArray(): [K, V][]
    Copy(): Map<K, V>
    Keys(): K[]
    Values(): V[]
}

Map.prototype.toArray = function toArray<K, V>(): [K, V][] {
    const arr: [K, V][] = []
    this.forEach((v, k) => arr.push([k, v]))
    return arr
}

Map.prototype.Copy = function <K, V>(): Map<K, V> {
    const map: Map<K, V> = new Map
    this.forEach((v, k) => map.set(v, k))
    return map
}

Map.prototype.Keys = function <K>(): K[] {
    const keys: K[] = []
    this.forEach((_, k) => keys.push(k))
    return keys
}

Map.prototype.Values = function <V>(): V[] {
    const values: V[] = []
    this.forEach((v, _) => values.push(v))
    return values
}