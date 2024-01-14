import { Array2D, XY } from "./XY";

export class Matrix<U extends number | bigint> {
    Matrix: Array2D<U>
    Size: number
    constructor(matrix: Array2D<U>) {
        if (matrix.Size.X !== matrix.Size.Y)
            throw new Error('Matrix must be square')
        this.Matrix = matrix
        this.Size = matrix.Size.X
    }
    Determinant(): U {
        if (this.Size === 2) {
            return (this.Matrix.get(XY.Zero)! * this.Matrix.get(XY.One)! -
                this.Matrix.get(XY.Right)! * this.Matrix.get(XY.Up)! ) as U
        }
        else {
            //split up matrix
            //alternating sum

            return this.Matrix.getRow(0).reduce((sum, n, i) => {
                if (n === undefined) throw new Error('undef in matrix')
                let sub = new Matrix(new Array2D<U>(new XY(this.Size - 1)))
                sub.Matrix.Array = this.Matrix.Array.slice(1).map(a => {
                    const arr = a.CopyFast()
                    arr.splice(i, 1)
                    return arr
                })
                
                const det = sub.Determinant()
                // casts are a lie to appease ts
                return (i % 2 === 0 ? (sum! as number + n! * det) : (sum! - n! * det)) as U

            }, ((typeof this.Matrix.Array[0][0] === 'number') ? 0 : 0n) as U)!
        }
    }

    Copy() {
        return new Matrix(this.Matrix.Copy())
    }

    Log() {
        console.log(`Matrix${this.Size}x${this.Size}`)

        this.Matrix.Array.forEach((row, i) => {
            console.log('| ' +
                row.map(v => (
                    v === undefined ? 'NaN' :
                    (v === Infinity || (typeof v === 'number' && v >= Number.MAX_SAFE_INTEGER)) ? '∞' :
                    v.toString()
                ).padStart(18)
                ).join('') +' |'
            )
        })
    }
}