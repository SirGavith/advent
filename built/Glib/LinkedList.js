"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiLinkedNode = exports.LinkedNode = exports.BiLinkedList = exports.LinkedList = void 0;
class LinkedList {
    Head = undefined;
    Final = undefined;
    constructor() {
    }
    Push(node) {
        if (this.Final) {
            this.Final.Next = node;
        }
        else {
            this.Head = node;
        }
        this.Final = node;
    }
    toArray(maxCount = Number.MAX_SAFE_INTEGER) {
        const arr = [];
        let node = this.Head;
        if (node === undefined)
            return [];
        for (let i = 0; node.Next && i < maxCount; i++) {
            arr.push(node.Value);
            node = node.Next;
        }
        return arr;
    }
    ForEach(lambda, maxCount = Number.MAX_SAFE_INTEGER) {
        let node = this.Head;
        if (node === undefined)
            return;
        for (let i = 0; node.Next && i < maxCount; i++) {
            const brk = lambda(node);
            if (brk)
                break;
            node = node.Next;
        }
    }
    Count() {
        let count = 0;
        let node = this.Head;
        while (node) {
            count++;
            node = node.Next;
        }
        return count;
    }
    BigCount() {
        let count = 0n;
        let node = this.Head;
        while (node) {
            count++;
            node = node.Next;
        }
        return count;
    }
    toString(maxCount = Number.MAX_SAFE_INTEGER) {
        return this.toArray(maxCount).join();
    }
    Log(maxCount = Number.MAX_SAFE_INTEGER) {
        console.log(this.toArray(maxCount).join());
    }
}
exports.LinkedList = LinkedList;
class BiLinkedList extends LinkedList {
    Push(node) {
        if (this.Final) {
            this.Final.Next = node;
            node.Prev = this.Final;
        }
        else {
            this.Head = node;
        }
        this.Final = node;
    }
    ForEach(lambda, maxCount = Number.MAX_SAFE_INTEGER) {
        let node = this.Head;
        if (node === undefined)
            return;
        for (let i = 0; node.Next && i < maxCount; i++) {
            const brk = lambda(node);
            if (brk === true)
                break;
            node = node.Next;
        }
    }
    Count() {
        let count = 0;
        let node = this.Head;
        if (node === undefined)
            return 0;
        do {
            count++;
            node = node.Next;
        } while (node && node !== this.Head);
        return count;
    }
    RemoveNode(node) {
        if (node.Prev === undefined)
            throw new Error('Cannot remove node with no prev');
        node.Prev.Next = node.Next;
        if (node.Next === undefined)
            throw new Error('Cannot remove node with no next');
        node.Next.Prev = node.Prev;
        if (this.Head === node)
            this.Head = node.Next;
        if (this.Final === node)
            this.Final = node.Next;
    }
}
exports.BiLinkedList = BiLinkedList;
class LinkedNode {
    Value;
    Next;
    constructor(Value) {
        this.Value = Value;
    }
    InsertAfter(node) {
        node.Next = this.Next;
        this.Next = node;
    }
    Copy() {
        const n = new LinkedNode(this.Value);
        n.Next = this.Next;
        return n;
    }
}
exports.LinkedNode = LinkedNode;
class BiLinkedNode extends LinkedNode {
    Prev;
    InsertAfter(node) {
        const nn = node.Next;
        node.Next = this;
        this.Prev = node;
        this.Next = nn;
        if (nn !== undefined) {
            nn.Prev = this;
        }
    }
    Copy() {
        const n = new BiLinkedNode(this.Value);
        n.Next = this.Next;
        n.Prev = this.Prev;
        return n;
    }
}
exports.BiLinkedNode = BiLinkedNode;
