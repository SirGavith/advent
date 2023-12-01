import { XY } from "./XY"

export class Cx {
    Re: number
    Im: number

    constructor()
    constructor(Real: number)
    constructor(Real: number, Imaginary: number)
    constructor(re?: number, im?: number) {
        this.Re = re ?? 0
        this.Im = im ?? 0
    }

    get Norm() { return Math.sqrt(this.Re ** 2 + this.Im ** 2) }
    get TaxicabNorm() { return Math.abs(this.Re) + Math.abs(this.Im) }

    plus(b: Cx): Cx {
        return new Cx(this.Re + b.Re, this.Im + b.Im)
    }
    minus(b: Cx) {
        return new Cx(this.Re - b.Re, this.Im - b.Im)
    }
    times(b: Cx) {
        const k1 = b.Re * (this.Re + this.Im)
        const k2 = this.Re * (b.Im - b.Re)
        const k3 = this.Im * (b.Re + b.Im)
        return new Cx(k1 - k3, k1 + k2)
    }

    RoundFloating(): Cx {
        return new Cx(this.Re.RoundFloating(), this.Im.RoundFloating())
    }

    toXY(): XY {
        return new XY(this.Re, this.Im)
    }

    toString(): string {
        if (this.Re === 0 && this.Im === 1) return 'i'
        if (this.Re === 0 && this.Im === -1) return '-i'

        const re = this.Re.toString()

        if (this.Im === 0)  return re
        if (this.Im === 1)  return re + ' + i'
        if (this.Im === -1) return re + ' - i'

        if (this.Im > 0) return re + ' + ' + this.Im.toString() + 'i'
        if (this.Im < 0) return re + ' - ' + (0-this.Im).toString() + 'i'

        throw new Error('shouldnt get here')
    }

    Log(): Cx {
        console.log(this.toString())
        return this
    }

    static fromAngle(phi: number) {
        return new Cx(Math.cos(phi), Math.sin(phi)).RoundFloating()
    }

    static fromTuple(t: [number, number]) {
        return new Cx(t[0], t[1])
    }

    static get One() { return new Cx(1, 0) }
    static get NOne() { return new Cx(-1, 0) }
    static get i() { return new Cx(0, 1) }
    static get Ni() { return new Cx(0, -1) }
}