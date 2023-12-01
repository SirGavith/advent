interface BigInt {
    /** @returns The number of digits of a bigint */
    DigitCount(): number
    /** @returns An array of the digits of the bigint */
    IntDigits(): number[]
    SumDigits(): number;
    /** Takes the square root of a bigint to a certain presicion
     * @param precision The number of digits of precision
     * @returns The square root digits as a bigint -- no decimal
     */
    SqrtDigits(precision: number): bigint
    Sq(): bigint
    Exp(pow: bigint): bigint
    Factorial(): bigint
    RotateDigits(): bigint
    IsPrime(): boolean
}
BigInt.prototype.DigitCount = function() {
    return this.toString().length
}
BigInt.prototype.IntDigits = function() {
    return [...this.toString()].map(n => parseInt(n))
}
BigInt.prototype.SumDigits = function() {
    return this.IntDigits().reduce((p, c) => p + c)
}
BigInt.prototype.SqrtDigits = function(precision: number) {
    if (this.valueOf() > 99 ||this.valueOf() < 1) {
        throw new RangeError("n must be between 1 < n <= 99")
    }
    let result = 0n,
        remainder = 0n,
        step = 0n

    while (step < precision) {
        let c = 100n * remainder
        c += step == 0n ? this.valueOf() : 0n
        let x = 0n
        while (true) {
            if (x * (20n * result + x) > c) {
                x--
                break
            }
            x++
        }

        let y = x * (20n * result + x)
        remainder = c - y
        if (c == y) {
            // console.log('found result')
            break
        }
        result *= 10n
        result += x
        step++
    }
    return result
}
BigInt.prototype.Exp = function(exp: bigint) {
    let x = 1n
    for (let i = 0n; i < exp; i++) {
        x *= this.valueOf()
    }
    return x
}
BigInt.prototype.Sq = function() {
    let n = this.valueOf()
    return n * n
}
BigInt.prototype.Factorial = function() {
    let x = 1n
    for (let i = this.valueOf(); i > 1; i--) {
        x *= i
    }
    return x
}
BigInt.prototype.RotateDigits = function() {
    let digits = [...this.toString()]
    digits.push(digits.shift() ?? '');
    return BigInt(digits.join(''))
}
BigInt.prototype.IsPrime = function() {
    let n = this.valueOf()
    for (let i = 2n; i * i <= n; i++) {
        if (n % i === 0n) return false;
    }
    return true
}