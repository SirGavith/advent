import * as Console from "./Console"

interface String {
    toIntList(radix?: number, delim?: string): number[]
    toFloatList(delim?: string): number[]
    toInt(radix?: number): number
    toFloat(radix?: number): number
    toNumsArray(): number[]
    toArray(includeNewlines?: boolean): string[]
    in(str: string): boolean
    SplitLines(): string[]
    Split2Lines(): string[]
    RegexTest(regex: RegExp): boolean
    ReplaceMap(map: { [key: string]: string }): string
    RemoveChars(chars: string[]): string
    IsAllCapital(): boolean
    forEach(lambda: (val: string, index: number) => void): void
    AsColor(color: string): string
    Log(color?: string): string
}
String.prototype.forEach = function(lambda: (val: string, index: number) => void) {
    this.toArray().forEach((v, i) => lambda(v, i))
}
String.prototype.toIntList = function(radix?: number, delim = '\n') {
    return this.split(delim).map(n => parseInt(n.trim(), radix))
}
String.prototype.toFloatList = function(delim = '\n') {
    return this.split(delim).map(n => parseFloat(n))
}
String.prototype.toInt = function(radix?: number) {
    const int = parseInt(this.valueOf(), radix)
    if (isNaN(int)) throw new Error('String: \''+ this + '\' is not a number')
    return int
}
String.prototype.toFloat = function() {
    const float = parseFloat(this.valueOf())
    if (isNaN(float)) throw new Error('String: \'' + this + '\' is not a float')
    return float
}
String.prototype.toNumsArray = function() {
    const nums: string[] = []
    let numI = 0
    let isNumber = false
    for (let i = 0; i < this.length; i++) {
        const code = this.charCodeAt(i)
        if (code >= 48 && code <= 57) {
            //digit
            if (!isNumber) {
                nums[numI] = ''
            }
            isNumber = true

            nums[numI] += this.charAt(i)

        }
        else {
            if (isNumber) {
                isNumber = false
                numI++
            }
        }
    }

    return nums.toIntArray()
}
String.prototype.toArray = function(includeNewlines = true) {
    if (!includeNewlines) {
        return [...this].filter(v => {
            return v !== '\n'
        })
    }
    return [...this]
}
String.prototype.in = function(str: string) {
    return str.includes(this.valueOf())
}
String.prototype.SplitLines = function() {
    return this.valueOf().split('\n').map(s => s.replaceAll('\r', ''))
}
String.prototype.Split2Lines = function () {
    return this.valueOf().split('\n\n').map(s => s.replaceAll('\r', ''))
}
String.prototype.RegexTest = function(regex: RegExp) {
    return regex.test(this.valueOf())
}
String.prototype.ReplaceMap = function(map: { [key: string]: string }) {
    let string = this.valueOf()
    Object.entries(map).forEach(keyval => {
        string = string.replaceAll(keyval[0], keyval[1])
    })
    return string
}
String.prototype.RemoveChars = function(chars: string[]) {
    let string = this.valueOf()
    chars.forEach(char => {
        string = string.replaceAll(char, '')
    })
    return string
}
String.prototype.IsAllCapital = function() {
    return this.toArray().every(char => char === char.toUpperCase())
}
String.prototype.AsColor = function(color: string) {
    return color + this + Console.Reset
}
String.prototype.Log = function(color?: string) {
    console.log(color ?? '' + this + Console.Reset)
    return this.valueOf()
}