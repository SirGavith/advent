"use strict";
const GeneratorPrototype = Object.getPrototypeOf(function* () { }).prototype;
GeneratorPrototype.Map = function* (mapper) {
    for (const val of this) {
        yield mapper(val);
    }
};
GeneratorPrototype.Reduce = function* (action, initialValue = 0) {
    let accumulator = initialValue;
    for (const val of this) {
        accumulator = action(accumulator, val);
        // yield accumulator;
    }
    return accumulator;
};
