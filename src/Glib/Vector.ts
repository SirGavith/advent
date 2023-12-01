export class Vector {
    Dims: number
    Values: number[]

    constructor(...values: number[]) {
        this.Dims = values.length
        this.Values = values
    }

    // No operand
    mag(): number {
        return Math.sqrt(this.Values.map(v => v * v).Sum())
    }
    unit(): Vector {
        return this.div(this.mag())
    }

    //Scalar operand
    times(n: number) {
        return new Vector(...this.Values.map(v => v * n))
    }
    div(n: number) {
        return new Vector(...this.Values.map(v => v / n))
    }
    scaleTo(mag: number): Vector {
        let cmag = this.mag()
        return new Vector(...this.Values.map(v => v * mag / cmag))
    }

    //Vector operand
    plus(vec:Vector) {
        if (vec.Dims !== this.Dims) throw new Error('Vector dimensionality must match')
        return new Vector(...this.Values.map((v, i) => v + vec.Values[i]))
    }
    minus(vec: Vector) {
        if (vec.Dims !== this.Dims) throw new Error('Vector dimensionality must match')
        return new Vector(...this.Values.map((v, i) => (v - vec.Values[i]).RoundFloating()))
    }    

    dot(vec: Vector) {
        if (vec.Dims !== this.Dims) throw new Error('Vector dimensionality must match')
        return this.Values.reduce((r, v, i) => r + v * vec.Values[i], 0)
    }
    cross(vec: Vector) {
        if (vec.Dims !== 3 || this.Dims !== 3) throw new Error('Vector dimensionality must match to 3')
        return new Vector(
            this.Values[1] * vec.Values[2] - this.Values[2] * vec.Values[1],
            this.Values[2] * vec.Values[0] - this.Values[0] * vec.Values[2],
            this.Values[0] * vec.Values[1] - this.Values[1] * vec.Values[0],
        )
    }

    angle(that: Vector): number {
        return Math.acos(this.dot(that) / (this.mag() * that.mag()))
    }

    IsParallel(that: Vector): boolean {
        return this.dot(that) === 0
    }

    //Scalar Projection
    comp(onto: Vector): number {
        return this.dot(onto) / onto.mag()
    }
    //Vector Projection
    proj(onto: Vector): Vector {
        return onto.times(this.dot(onto) / (onto.mag() ** 2))
    }

    static i = new Vector(1, 0, 0)
    static j = new Vector(0, 1, 0)
    static k = new Vector(0, 0, 1)

    static Parse(v: string): Vector {
        v = v.RemoveChars([' '])
        v = v.ReplaceMap({
            '−': '-',
            'i⃗': 'i',
            'j⃗': 'j',
            'k⃗': 'k',
        })
        if ((v.startsWith('⟨') && v.endsWith('⟩')) ||
            (v.startsWith('<') && v.endsWith('>')) ||
            (v.startsWith('(') && v.endsWith(')'))) {
            return new Vector(...v.slice(1, -1).split(',').map(n => n.toFloat()))
        }
        else if (v.includes('i')) {
            // −2i+2j−k
            let terms = []
            let termBeginIndex = 0
            for (let i = 1; i < v.length; i++) {
                const char = v[i]
                if ('ijk'.includes(char)) {
                    terms.push(v.slice(termBeginIndex, i))
                    termBeginIndex = i + 1
                }
            }
            return new Vector(...terms.map(t => {
                if (t.length === 1)
                    t += '1'
                return t.toFloat()
            }))

        }
        return new Vector(...v.split(',').map(n => n.toFloat()))
    }
    
    LogIJK(): Vector {
        if (this.Dims === 3) {
            console.log(`Vec3 ${this.Values[0].toPrecision(5)}i + ${this.Values[1].toPrecision(5)}j + ${this.Values[2].toPrecision(5)}k`)
        }
        else if (this.Dims === 2) {
            console.log(`Vec2 ${this.Values[0].toPrecision(3)}i + ${this.Values[1].toPrecision(3)}j`)
        }
        else {
            this.LogIJK()
        }
        return this
    }

    Log(): Vector {
        console.log(`Vec${this.Dims}<${this.Values.join(',')}>`)
        return this
    }
}