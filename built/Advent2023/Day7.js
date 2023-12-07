"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
//part 1
const map = { T: '10', J: '11', Q: '12', K: '13', A: '14' };
main_1.Data.map(l => l.split(' ')).map(([cards, b]) => [
    b.toInt(),
    cards.toArray().Frequencies().sort((i, j) => j[1] - i[1]).map(c => c[1]).join('').padEnd(5, '0').toInt(),
    cards.toArray().map(char => char.ReplaceMap(map).toInt())
])
    .sort(([_, aScore, aTieScore], [__, bScore, bTieScore]) => {
    const j = aTieScore.findIndex((_, i) => aTieScore[i] !== bTieScore[i]);
    return aScore !== bScore ? aScore - bScore : aTieScore[j] - bTieScore[j];
}).map(([bid], i) => bid * (i + 1)).Sum().Log();
//part 2
const map2 = { T: '10', J: '1', Q: '12', K: '13', A: '14' };
main_1.Data.map(l => l.split(' ')).map(l => [l[0], l[1].toInt()])
    .sort(([a, _], [b, __]) => {
    // console.log()
    const aJCount = a.toArray().Frequency('J');
    const bJCount = b.toArray().Frequency('J');
    let aScore0 = a.replaceAll('J', '').toArray().Frequencies().sort((i, j) => j[1] - i[1]).map(c => c[1]);
    let bScore0 = b.replaceAll('J', '').toArray().Frequencies().sort((i, j) => j[1] - i[1]).map(c => c[1]);
    // if (aScore0.length === 0) aScore0 = [0]
    // if (bScore0.length === 0) bScore0 = [0]
    aScore0.IncrementOrCreate(0, aJCount);
    bScore0.IncrementOrCreate(0, bJCount);
    const aScore = aScore0.join('').padEnd(5, '0').toInt();
    const bScore = bScore0.join('').padEnd(5, '0').toInt();
    // console.log(a.join(''), aScore)
    // console.log(b.join(''), bScore)
    if (aScore !== bScore) {
        // console.log('win', aScore - bScore)
        return aScore - bScore;
    }
    for (let i = 0; i < 5; i++) {
        const aScore2 = a[i].ReplaceMap(map2).toInt();
        const bScore2 = b[i].ReplaceMap(map2).toInt();
        if (aScore2 !== bScore2) {
            // console.log('tie', aScore2 - bScore2)
            return aScore2 - bScore2;
        }
    }
    throw new Error;
}).map(([_, bid], i) => bid * (i + 1)).Sum().Log();
//part 2 condensed
main_1.Data.map(l => l.split(' '))
    .map(([cards, b]) => [
    b.toInt(),
    cards.replaceAll('J', '').toArray().Frequencies(true).map(c => c[1])
        .IncrementOrCreate(0, cards.toArray().Frequency('J'))
        .join('').padEnd(5, '0').toInt(),
    cards.toArray().map(char => char.ReplaceMap(map2).toInt()),
]).Log()
    .sort(([_, aScore, aTieScore], [__, bScore, bTieScore]) => {
    const j = aTieScore.findIndex((_, i) => aTieScore[i] !== bTieScore[i]);
    return aScore !== bScore ? aScore - bScore : aTieScore[j] - bTieScore[j];
}).map(([bid], i) => bid * (i + 1)).Sum().Log();
