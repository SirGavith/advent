import { print } from "../Glib/Console";
import { Filer } from "../Glib/Filer";
import { Array3D, XYZ } from "../Glib/XYZ";
import { Data } from "../main";

const logArr = (a: Array3D<number>) => {
    for (let z = a.Size.Z - 1; z >= 0; z--) {
        for (let y = 0; y < a.Size.Y; y++) {
            for (let x = 0; x < a.Size.X; x++) {
                const v = a.Array[z][y][x]
                print((v?.toString(10) ?? '.').padEnd(4))
            }
            print('   ')
        }
        print('\n')
    }
}

const canBrickFall = (arr: Array3D<number>, brickPositions: XYZ[], brickIndex: number) => {
    return brickPositions.every(brickPosition => {
        const below = arr.get(brickPosition.minus(0, 0, 1))
        return below === undefined || below === brickIndex
    })
}
const tryFallBrick = (arr: Array3D<number>, brickPositions: XYZ[], brickIndex: number): boolean => {
    if (canBrickFall(arr, brickPositions, brickIndex)) {
        brickPositions.forEach(brickPosition => {
            arr.set(brickPosition, undefined)
            brickPosition.minusEQ(0, 0, 1)
            arr.set(brickPosition, brickIndex)
        })
        return true
    }
    return false
}

function WriteBricks() {
    const [arr, BricksPositions] = ReadFallBricksArr()

    // logArr()

    Filer.WriteJSON('./data/day22arr.json', arr)
    Filer.WriteJSON('./data/day22bricks.json', BricksPositions)
}

function ReadFallBricksArr(): [Array3D<number>, XYZ[][]] {
    const Bricks = Data.map(l => l.split('~').map(xyz => XYZ.fromString(xyz)) as [XYZ, XYZ])

    const arr = new Array3D<number>(XYZ.ArraySizeOffset(Bricks.flat())[0].plus(0, 0, 1), undefined, true)

    for (let x = 0; x < arr.Size.X; x++) {
        for (let y = 0; y < arr.Size.Y; y++) {
            arr.set(new XYZ(x, y, 0), -1)
        }
    }

    const BricksPositions: XYZ[][] = []

    Bricks.forEach((brick, i) => {
        brick[1].foreachCombination(xyz => {
            arr.set(xyz, i)
            BricksPositions.PushOrCreate2D(i, xyz)
        }, brick[0])
    })

    while (BricksPositions.reduce((fell, bricksPositions, i) =>
        fell || tryFallBrick(arr, bricksPositions, i)
        , false)) { }

    return [arr, BricksPositions]
}

function part1() {
    // BricksPositions.Count((_, i) => {
    //     //see if I can elim brick
    //     const makesFall = BricksPositions.some((otherBrickPositions, otherBrickI) =>
    //         canBrickFall(otherBrickPositions, otherBrickI, i))

    //     console.log(i, makesFall)

    //     return !makesFall
    // }).Log()
}

function part2() {
    // const arr = Object.assign(new Array3D<number>(XYZ.Zero), Filer.ReadJson('./data/day22arr.json')) as Array3D<number>
    // arr.Size = Object.assign(new XYZ, arr.Size)
    // const BricksPositions = (Filer.ReadJson('./data/day22bricks.json') as XYZ[][]).map(l => l.map(a => Object.assign(new XYZ, a)))

    const [arr, BricksPositions] = ReadFallBricksArr()


    logArr(arr)
    // BricksPositions.Log()

    
    BricksPositions.map((_, i) => {
        //count falls
        let fallenBricks = new Set<number>()
        //copy arr and bricksPositions

        const arr2 = arr.Copy()
        const BricksPositions2 : (XYZ[] | undefined)[] = BricksPositions.map(a => a.map(b => b.Copy()))

        //remove brick
        BricksPositions2[i]!.forEach(brickPosition => {
            arr2.set(brickPosition, undefined)
        })
        BricksPositions2[i] = undefined

        logArr(arr2)
        // BricksPositions2.Log()

        while (BricksPositions2.reduce((fellYet, bricksPositions, i) => {
            if (bricksPositions === undefined) return fellYet
            const fellNow = tryFallBrick(arr2, bricksPositions, i)
            if (fellNow) fallenBricks.add(i)
            return fellYet || fellNow
        }, false)) { }

        console.log(i, fallenBricks.size, fallenBricks)

        return fallenBricks.size
    }).Sum().Log()  
}

// InitFallBricks()

part2()