import { Matrix } from "../Glib/Matrix";
import { Array2D, XY } from "../Glib/XY";
import { XYZ } from "../Glib/XYZ";
import { Data } from "../main";

//thanks to topaz for this algebraic solution
//https://topaz.github.io/paste/#XQAAAQANDAAAAAAAAAArmUAGM0NwXMLp2PQFNgRmh8ezkFKvEQd5obzMZwooEj1R498QeYDSxeTiF400W5Ml85PHQXQ/t4JmA7LkXWLwCOuXjTUZ9cIX/jhhvcP8EwiigBA3i2aj2uwkTmPRUpEAhQcV3gFGRBZdv0QomIXupqptd/ZH+3xPKdlV6/b5otDSX93R82DTUevMK4ls0CJH7GExO62B4wsmGGLkWmUKpcUGjlRc6tnITVvD3GlONpMJeiLCP4CkT3fijH+LNeuijMoQO9curNNpIl/taPOLl36w+BZ4vroViny70gkz/pW1oV6mMkc5X+TUg+iszuafPivIAvsNmi5rdnobza5b1zLS1gG5VRBQm0xqlQ2ssvgQWD4pmrDVt0CUbQDnYN9SOUWUQhf9dH8Ih/78LE0mtSkUEX8yaTWqZkM1teONYoil2yC0gv2CcSKAAyBrWAqyiJ1IytGAMFpEnHnkWQBQHECQeQDBQwMV185CJMVXVJZvdbd673BNadRSmbY1tVaQo2Y2TAoqhglSQ2R+6vnl8a4kChB5XIMh/Rzf5Lre58IQ01Lu/EiJd7pe2ceM4U29XjhEmSUB4iQGLx3piB84WA8ixC0XLYEzjIfOKumlGMmoB2OtcBeio+MsLjBN8PdoUfiYX7EzBxv++JnFikhGKiJVDy6JWJPZgBYhYmHRVyz21u3NKwMqy4ET8shjXmT5UYh8MBQ/VHrKOF7YqDPkCvs2mm4PqRwjjMYbGmhmVXxU0emhxicM2H8XljNGsOmPk/EEziz6S3i8FDVIcFpkQkoQPLHhlI59Rg+ZePfiFn9zGbFQFfAXhiER+uKCuwndMY5ePfKhQIvdYTVVcjR5Hwhv8zMuAyAQeqHnyrce6XpPIBp5tpAvCmFTbUCDqJez5ONUX50z6gFcgtGOwM1DLOD8YAYZZdXQ03BPgcw53VdrCvdVxypRrGxPBQTHnu260g8PSSAT7oejUZC/Mx3KfPOrkThbZfylM4nijiNDi+JrReW8UeLEX3M/j7uz9r+lE6m1YnE9BYa0G6B/qdCU2QBct/lf1i5rgd2iwy63angdaCDRBNRNflV8MFBLox94kezB0lwMvussr6bSkkr52hHjcWGMwShj+URNOmkTEEEnB/Ik5HAi+BZBq8vG5LvOkWDCQRn2+x5un8XIAHjP24dzCcS/VAFtLA6CNs4nt9EtlqtS6FvEU8eI7Kx628WHFF/7l83TS4vhWMtwCqh+jr6BEna3YOoTMjkMMfibN5St+5/2dLGxUqN4vVP4p0CTqGQYH9ku+C+szbAPICIxaTjkJNZm6Ix+vJod/j0Gug==


const h = Data.map(l =>
    l.replaceAll(' ', '').split('@').map(xyz =>
        XYZ.fromString(xyz))).map(([p, v]) => ({P: p, V: v}))


const matrix = new Matrix(new Array2D<bigint>(new XY(6)))
matrix.Matrix.Array = [
    [ h[0].V.Y - h[1].V.Y,   h[1].V.X - h[0].V.X,   0,                     h[1].P.Y - h[0].P.Y,   h[0].P.X - h[1].P.X,   0                   ],
    [ h[0].V.Z - h[1].V.Z,   0,                     h[1].V.X - h[0].V.X,   h[1].P.Z - h[0].P.Z,   0,                     h[0].P.X - h[1].P.X ],
    [ h[0].V.Y - h[2].V.Y,   h[2].V.X - h[0].V.X,   0,                     h[2].P.Y - h[0].P.Y,   h[0].P.X - h[2].P.X,   0                   ],
    [ h[0].V.Z - h[2].V.Z,   0,                     h[2].V.X - h[0].V.X,   h[2].P.Z - h[0].P.Z,   0,                     h[0].P.X - h[2].P.X ],
    [ h[0].V.Y - h[3].V.Y,   h[3].V.X - h[0].V.X,   0,                     h[3].P.Y - h[0].P.Y,   h[0].P.X - h[3].P.X,   0                   ],
    [ h[0].V.Z - h[3].V.Z,   0,                     h[3].V.X - h[0].V.X,   h[3].P.Z - h[0].P.Z,   0,                     h[0].P.X - h[3].P.X ],
].map(r => r.map(v => BigInt(v)))

const vector = [
    BigInt(h[0].P.X) * BigInt(h[0].V.Y) - BigInt(h[0].P.Y) * BigInt(h[0].V.X) - BigInt(h[1].P.X) * BigInt(h[1].V.Y) + BigInt(h[1].P.Y) * BigInt(h[1].V.X),
    BigInt(h[0].P.X) * BigInt(h[0].V.Z) - BigInt(h[0].P.Z) * BigInt(h[0].V.X) - BigInt(h[1].P.X) * BigInt(h[1].V.Z) + BigInt(h[1].P.Z) * BigInt(h[1].V.X),
    BigInt(h[0].P.X) * BigInt(h[0].V.Y) - BigInt(h[0].P.Y) * BigInt(h[0].V.X) - BigInt(h[2].P.X) * BigInt(h[2].V.Y) + BigInt(h[2].P.Y) * BigInt(h[2].V.X),
    BigInt(h[0].P.X) * BigInt(h[0].V.Z) - BigInt(h[0].P.Z) * BigInt(h[0].V.X) - BigInt(h[2].P.X) * BigInt(h[2].V.Z) + BigInt(h[2].P.Z) * BigInt(h[2].V.X),
    BigInt(h[0].P.X) * BigInt(h[0].V.Y) - BigInt(h[0].P.Y) * BigInt(h[0].V.X) - BigInt(h[3].P.X) * BigInt(h[3].V.Y) + BigInt(h[3].P.Y) * BigInt(h[3].V.X),
    BigInt(h[0].P.X) * BigInt(h[0].V.Z) - BigInt(h[0].P.Z) * BigInt(h[0].V.X) - BigInt(h[3].P.X) * BigInt(h[3].V.Z) + BigInt(h[3].P.Z) * BigInt(h[3].V.X),
]

const det = matrix.Determinant();

//only need to do first half of Cramer's rule
//R.X, R.Y, R.Z, R.V.X, R.V.Y, R.V.Z
[0, 1, 2, 3, 4, 5].map(i => {
    const top = matrix.Copy()
    top.Matrix.setCol(i, vector)
    return top.Determinant() / det
}).Log().slice(0, 3).Sum().Log()
