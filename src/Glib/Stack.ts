export class Stack<T> {
    private array: T[]

    constructor(Array: T[] = []) {this.array = Array}

    get Count() {
        return this.array.length
    }

    Peek() {
        return this.array.at(-1)
    }

    Pop() {
        return this.array.pop()
    }

    Push(val: T) {
        this.array.push(val)
    }

    Clear() {
        this.array = []
    }

    get Array() : T[] {
        return this.array.Copy()
    }

    toString() {
        return this.array.toString()
    }

}