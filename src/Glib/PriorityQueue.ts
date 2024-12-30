const Top = 0;
const Parent = (i: number) => ((i + 1) >>> 1) - 1;
const Left = (i: number) => (i << 1) + 1;
const Right = (i: number) => (i + 1) << 1;

export class PriorityQueue<T> {
    private _heap: T[]
    private _comparator

    constructor(comparator = (a: T, b: T) => a > b) {
        this._heap = [];
        this._comparator = comparator;
    }
    size() {
        return this._heap.length;
    }
    isEmpty() {
        return this.size() == 0;
    }
    peek(): T | undefined {
        return this._heap[Top];
    }
    push(...values: T[]) {
        values.forEach(value => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }
    pop(): T | undefined  {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > Top) {
            this._swap(Top, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }
    replace(value: T): T | undefined  {
        const replacedValue = this.peek();
        this._heap[Top] = value;
        this._siftDown();
        return replacedValue;
    }
    private _greater(i: number, j: number) {
        return this._comparator(this._heap[i], this._heap[j]);
    }
    private _swap(i: number, j: number) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
    private _siftUp() {
        let node = this.size() - 1;
        while (node > Top && this._greater(node, Parent(node))) {
            this._swap(node, Parent(node));
            node = Parent(node);
        }
    }
    private _siftDown() {
        let node = Top;
        while (
            (Left(node) < this.size() && this._greater(Left(node), node)) ||
            (Right(node) < this.size() && this._greater(Right(node), node))
        ) {
            let maxChild = (Right(node) < this.size() && this._greater(Right(node), Left(node))) ? Right(node) : Left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}


// Example:

// { const top = 0, parent = c => (c + 1 >>> 1) - 1, left = c => (c << 1) + 1, right = c => c + 1 << 1; class PriorityQueue { constructor(c = (d, e) => d > e) { this._heap = [], this._comparator = c } size() { return this._heap.length } isEmpty() { return 0 == this.size() } peek() { return this._heap[top] } push(...c) { return c.forEach(d => { this._heap.push(d), this._siftUp() }), this.size() } pop() { const c = this.peek(), d = this.size() - 1; return d > top && this._swap(top, d), this._heap.pop(), this._siftDown(), c } replace(c) { const d = this.peek(); return this._heap[top] = c, this._siftDown(), d } _greater(c, d) { return this._comparator(this._heap[c], this._heap[d]) } _swap(c, d) { [this._heap[c], this._heap[d]] = [this._heap[d], this._heap[c]] } _siftUp() { for (let c = this.size() - 1; c > top && this._greater(c, parent(c));)this._swap(c, parent(c)), c = parent(c) } _siftDown() { for (let d, c = top; left(c) < this.size() && this._greater(left(c), c) || right(c) < this.size() && this._greater(right(c), c);)d = right(c) < this.size() && this._greater(right(c), left(c)) ? right(c) : left(c), this._swap(c, d), c = d } } window.PriorityQueue = PriorityQueue }

// // Default comparison semantics
// const queue = new PriorityQueue();
// queue.push(10, 20, 30, 40, 50);
// console.log('Top:', queue.peek()); //=> 50
// console.log('Size:', queue.size()); //=> 5
// console.log('Contents:');
// while (!queue.isEmpty()) {
//     console.log(queue.pop()); //=> 40, 30, 20, 10
// }

// // Pairwise comparison semantics
// const pairwiseQueue = new PriorityQueue((a, b) => a[1] > b[1]);
// pairwiseQueue.push(['low', 0], ['medium', 5], ['high', 10]);
// console.log('\nContents:');
// while (!pairwiseQueue.isEmpty()) {
//     console.log(pairwiseQueue.pop()[0]); //=> 'high', 'medium', 'low'
// }

// .as - console - wrapper{ min - height: 100 %}
