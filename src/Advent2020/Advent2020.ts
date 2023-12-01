class Advent2020 {
    static Day1(data: string) {
        data.toIntList().forEachGroup(3, (values) => {
            if (values.Sum() == 2020) {
                console.log(values, values.Product())
            }
        }, false, false)
    }
    static Day2(d: string) {
        console.log(d.SplitLines().reduce((count, password) => {
            let p = password.split(' ')
            const range = p[0].split('-').toIntArray(),
                letter = p[1][0],
                pass = p[2];
            console.log(range, letter, pass)

            //(pass.split(letter).length - 1).InRangeEq(range[0], range[1]).IsTrue(() => count++)
            if ((pass[range[0] - 1] == letter) != (pass[range[1] - 1] == letter)) count++
            return count
        }, 0))
    }
    static Day3(d: string) {
        const data = d.SplitLines()
        let trees = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]].map(slope => {
            let x = 0,
                y = 0,
                count = 0
            while (true) {
                x += slope[0]
                y += slope[1]
                if (y >= data.length) return count
                if (data[y][x % data[y].length] == '#') count++
            }
        })
        console.log(trees)
        console.log(trees.Product())
    }
    static Day4(d: string) {
        const data = d.split('\n\n').map(p => Object.fromEntries(p.split(/\n| /).map(field => field.split(':'))))

        data.reduce((count, passport) => {
            console.log(passport)
            const hgt = passport['hgt']
            return passport['byr']?.toInt().InRangeEq(1920, 2002) &&
            passport['iyr']?.toInt().InRangeEq(2010, 2020) &&
            passport['eyr']?.toInt().InRangeEq(2020, 2030) &&
            passport['hgt'] && (
                (hgt.endsWith('cm') && hgt.slice(0, -2).toInt().InRangeEq(150, 193)) ||
                (hgt.endsWith('in') && hgt.slice(0, -2).toInt().InRangeEq(59, 76))) &&
            passport['hcl']?.RegexTest(/#[a-f0-9]{6}/) &&
            passport['ecl']?.RegexTest(/amb|blu|brn|gry|grn|hzl|oth/) &&
            passport['pid']?.RegexTest(/[0-9]{9}/) ? ++count : count

            //return ['byr','iyr','eyr','hgt','hcl','ecl','pid'].every(field => passport[field])
        }, 0).Log()
    }
    static Day5(data: string) {
        const ids = data.SplitLines().map(d => 
            d.slice(0, -3).ReplaceMap({'F': '0', 'B': '1'}).toInt(2) * 8 +
            d.slice(-3).ReplaceMap({'L': '0', 'R': '1'}).toInt(2)
        ).sort((a, b) => a - b)
        ids.reduce((prev, current) => {
            if (prev != current - 1) {
                (current - 1).Log()
            }
            return current
        })
    }
    static Day6(data: string) {
        data.split('\n\n').map(d => {
            // return d.toCharArray(false).Uniques().length
            
            const dd = d.SplitLines()
            let shared = dd[0].toArray()
            dd.forEach(person => {
                shared = shared.filter(answer => person.includes(answer))
            })
            return shared.length
        }).Sum().Log()
    }
}

Advent2020.Day6(`abc

a
b
c

ab
ac

a
a
a
a

b`)