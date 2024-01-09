interface Set<T> {
    toArray(): T[]
}

Set.prototype.toArray = function toArray<T>(): T[] {
    const arr: T[] = []
    this.forEach(v => arr.push(v))
    return arr
}