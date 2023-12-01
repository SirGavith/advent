export class LinkedList<T> {
    public Head: LinkedNode<T> | undefined = undefined
    public Final: LinkedNode<T> | undefined = undefined

    constructor() {
    }

    Push(node: LinkedNode<T>) {
        if (this.Final) {
            this.Final.Next = node
        }
        else {
            this.Head = node
        }
        this.Final = node
    }

    toArray(maxCount = Number.MAX_SAFE_INTEGER) {
        const arr: T[] = []
        let node = this.Head
        if (node === undefined) return []
        for (let i = 0; node.Next && i < maxCount; i++) {
            arr.push(node.Value)
            node = node.Next
        }
        return arr
    }

    ForEach(lambda: (val: LinkedNode<T>) => boolean | void, maxCount: number = Number.MAX_SAFE_INTEGER) {
        let node = this.Head
        if (node === undefined) return
        for (let i = 0; node.Next && i < maxCount; i++) {
            const brk = lambda(node)
            if (brk) break
            node = node.Next
        }
    }

    Count() {
        let count = 0
        let node = this.Head
        while (node) {
            count++
            node = node.Next
        }
        return count
    }

    BigCount() {
        let count = 0n
        let node = this.Head
        while (node) {
            count++
            node = node.Next
        }
        return count
    }

    toString(maxCount = Number.MAX_SAFE_INTEGER) {
        return this.toArray(maxCount).join()
    }

    Log(maxCount = Number.MAX_SAFE_INTEGER) {
        console.log(this.toArray(maxCount).join())
    }
}

export class BiLinkedList<T> extends LinkedList<T> {
    declare Head: BiLinkedNode<T> | undefined
    declare Final: BiLinkedNode<T> | undefined

    override Push(node: BiLinkedNode<T>) {
        if (this.Final) {
            this.Final.Next = node
            node.Prev = this.Final
        }
        else {
            this.Head = node
        }
        this.Final = node
    }

    override ForEach(lambda: (val: BiLinkedNode<T>) => boolean | void, maxCount: number = Number.MAX_SAFE_INTEGER) {
        let node = this.Head

        if (node === undefined) return
        for (let i = 0; node.Next && i < maxCount; i++) {
            const brk = lambda(node)
            if (brk === true) break
            node = node.Next
        }
    }

    override Count() {
        let count = 0
        let node = this.Head
        if (node === undefined) return 0
        do {
            count++
            node = node.Next
        } while (node && node !== this.Head)
        return count
    }


    RemoveNode(node: BiLinkedNode<T>) {
        if (node.Prev === undefined) throw new Error('Cannot remove node with no prev')
        node.Prev.Next = node.Next
        if (node.Next === undefined) throw new Error('Cannot remove node with no next')
        node.Next.Prev = node.Prev

        if (this.Head === node) this.Head = node.Next
        if (this.Final === node) this.Final = node.Next
    }


}

export class LinkedNode<T> {
    public Value: T
    public Next: LinkedNode<T> | undefined
    constructor(Value: T) {
        this.Value = Value
    }

    InsertAfter(node: LinkedNode<T>) {
        node.Next = this.Next
        this.Next = node;
    }

    Copy() {
        const n = new LinkedNode(this.Value)
        n.Next = this.Next
        return n
    }
}

export class BiLinkedNode<T> extends LinkedNode<T> {
    declare Next: BiLinkedNode<T> | undefined
    public Prev: BiLinkedNode<T> | undefined
    
    override InsertAfter(node: BiLinkedNode<T>): void {
        const nn = node.Next
        node.Next = this

        this.Prev = node
        this.Next = nn
        if (nn !== undefined) {
            nn.Prev = this
        }
    }

    override Copy() {
        const n = new BiLinkedNode(this.Value)
        n.Next = this.Next
        n.Prev = this.Prev
        return n
    }
}