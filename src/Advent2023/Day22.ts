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

const canBrickFall = (arr: Array3D<number>, brickPositions: XYZ[], brickIndex: number, ignore?: number) => {
    return brickPositions.every(brickPosition => {
        const below = arr.get(brickPosition.minus(0, 0, 1))
        return below === undefined || below === brickIndex || (ignore !== undefined && below === ignore)
    })
}

function Fall(arr: Array3D<number>, BricksPositions: (XYZ[] | undefined)[]): number {
    let count = 0
    BricksPositions.forEach((brickPositions, i) => {
        if (brickPositions === undefined) return
        //see how far brick can fall
        let dz = 0
        while (
            brickPositions.every(brickPosition => {
                const below = arr.get(brickPosition.minus(0, 0, dz + 1))
                return below === undefined || below === i
            })
        ) { dz++ }

        if (dz === 0) return

        //fall brick that much
        brickPositions.forEach(brickPosition => {
            arr.set(brickPosition, undefined)
            brickPosition.minusEQ(0, 0, dz)
            arr.set(brickPosition, i)
        })
        count++
    })
    return count
}


function GetBricks(): [Array3D<number>, XYZ[][]] {
    const Bricks = Data.map(l => l.split('~').map(xyz => XYZ.fromString(xyz)) as [XYZ, XYZ])
    const arr = new Array3D<number>(XYZ.ArraySizeOffset(Bricks.flat())[0].plus(0, 0, 1), undefined, true)

    for (let x = 0; x < arr.Size.X; x++) {
        for (let y = 0; y < arr.Size.Y; y++) {
            arr.set(new XYZ(x, y, 0), -1)
        }
    }
    Bricks.sort((a, b) => a[0].Z - b[0].Z)

    const BricksPositions: XYZ[][] = []

    Bricks.forEach((brick, i) => {
        brick[1].foreachCombination(xyz => {
            arr.set(xyz, i)
            BricksPositions.PushOrCreate2D(i, xyz)
        }, brick[0])
    })

    Fall(arr, BricksPositions)
    
    return [arr, BricksPositions]
}


function part1() {
    const [arr, BricksPositions] = GetBricks()

    console.log('done falling')

    BricksPositions.Count((_, i) => {
        //see if I can elim brick
        const makesFall = BricksPositions.some((otherBrickPositions, otherBrickI) =>
            canBrickFall(arr, otherBrickPositions, otherBrickI, i))

        return !makesFall
    }).Log()
}

function part2() {
    const [arr, BricksPositions] = GetBricks()

    BricksPositions.map((_, i) => {
        //copy arr and bricksPositions
        const arr2 = arr.Copy()
        const BricksPositions2 : (XYZ[] | undefined)[] = BricksPositions.map(a => a.map(b => b.Copy()))

        //remove brick
        BricksPositions2[i]!.forEach(brickPosition => {
            arr2.set(brickPosition, undefined)
        })
        BricksPositions2[i] = undefined
        
        return Fall(arr2, BricksPositions2)
    }).Sum().Log()  
}

// part1()

part2()