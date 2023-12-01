export abstract class Sorts {
    static LeastFirst = (a: number, b: number) => a - b
    static GreatestFirst = (a: number, b: number) => b - a
    static Alphabetical = (a: string, b: string) => a.localeCompare(b)
}