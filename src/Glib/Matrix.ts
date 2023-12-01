import { Array2D, XY } from "./XY";

export class Matrix {
    Matrix: Array2D<number>
    Size: number
    constructor(matrix: Array2D<number>) {
        if (matrix.Size.X !== matrix.Size.Y)
            throw new Error('Matrix must be square')
        this.Matrix = matrix
        this.Size = matrix.Size.X
    }
    Determinant(): number {
        if (this.Size === 2) {
            return this.Matrix.get(XY.Zero)! * this.Matrix.get(XY.One)! -
                this.Matrix.get(XY.Right)! * this.Matrix.get(XY.Up)! 
        }
        else {
            //split up matrix
            //alternating sum

            return this.Matrix.getRow(0).reduce((sum, n, i) => {
                let sub = new Matrix(new Array2D<number>(new XY(this.Size - 1)))
                sub.Matrix.Array = this.Matrix.Array.slice(1).map(a => {
                    const arr = a.CopyFast()
                    arr.splice(i, 1)
                    return arr
                })

                const det = sub.Determinant()
                return i % 2 === 0 ? sum! +  n! * det : sum! - n! * det
            }, 0)!
        }
    }
}