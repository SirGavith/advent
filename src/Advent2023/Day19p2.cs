// See https://aka.ms/new-console-template for more information
using System.Buffers;
using System.Collections;
using System.Diagnostics;

var lines = File.ReadAllLines("./input.txt");

var stopwatch = Stopwatch.StartNew();

//AOC DAY 19 PART 2

var workflowsMap = new Dictionary<string, IEnumerable<Condition>>();

foreach (var line in lines) {
    if (line == "") break;
    // Console.WriteLine(line);

    var l = line.Split(['{', '}']);

    var conditions = l[1].Split(',').Select(condition => {
        var c = condition.Split(':');
        if (c.Length == 1) {
            return new Condition { constraint = null, destination = c[0] };
        }

        return new Condition {
            constraint = new Constraint {
                xmas = c[0][0],
                op = c[0][1],
                val = short.Parse(c[0].Remove(0,2))
            },
            destination = c[1]
        };
    });
    // map.Add(l[0],)
    // foreach (var c in conditions) {
    //     if (c.constraint.HasValue) {
    //         Console.WriteLine($"{c.constraint.Value.xmas}, {c.constraint.Value.op}, {c.constraint.Value.val} => {c.destination}");
    //     }
    //     else Console.WriteLine($"else => {c.destination}");
    // }

    workflowsMap.Add(l[0], conditions);
}


List<Constraint> getConstraintsIn(List<Constraint?> conds, int i, string name) {
    List<Constraint> c = new();
    if (conds[i].HasValue) {
        c.Add(conds[i]!.Value);
    }
    for (byte j = 0; j < i; j++) {
        c.Add(new Constraint {
            xmas = conds[j]!.Value.xmas,
            op = conds[j]!.Value.op == '<' ? 'G' : 'L',
            val = conds[j]!.Value.val
        });
    }
    c.AddRange(findConstraints(name));
    return c;
}

var memo = new Dictionary<string, List<Constraint>>
{
    { "in", new List<Constraint>() { } }
};

List<Constraint> findConstraints(string destname)
{
    List<Constraint> consts;
    if (memo.TryGetValue(destname, out consts!)) {
        return consts;
    }

    foreach (var kvp in workflowsMap!) {
        byte i = 0;
        foreach (var cond in kvp.Value) {
            if (cond.destination == destname) {
                var c = getConstraintsIn(kvp.Value.Select(c => c.constraint).ToList(), i, kvp.Key);
                memo.Add(destname, c);
                return c;
            }
            i++;
        }
    }
    throw new Exception();
}


// foreach (var c in findConstraints("px")) {
//     Console.WriteLine($"{c.xmas}, {c.op}, {c.val}");
// }

long sum = 0;
foreach (var kvp in workflowsMap!)
{
    byte i = 0;
    foreach (var cond in kvp.Value)
    {
        if (cond.destination == "A") {
            long[] xRange = [1L, 4001L];
            long[] mRange = [1L, 4001L];
            long[] aRange = [1L, 4001L];
            long[] sRange = [1L, 4001L];

            var constraints = getConstraintsIn(kvp.Value.Select(c => c.constraint).ToList(), i, kvp.Key);

            foreach (var rating in constraints) {
                var r = rating.xmas switch {
                    'x' => xRange,
                    'm' => mRange,
                    'a' => aRange,
                    's' => sRange,
                    _ => sRange
                };

                if (rating.op == '>' && rating.val + 1 > r[0])
                    r[0] = rating.val + 1;
                else if (rating.op == 'G' && rating.val > r[0])
                    r[0] = rating.val;
                else if (rating.op == '<' && rating.val < r[1])
                    r[1] = rating.val;
                else if (rating.op == 'L' && rating.val + 1 < r[1])
                    r[1] = rating.val + 1;
            }


            sum += (xRange[1] - xRange[0]) *
                   (mRange[1] - mRange[0]) *
                   (aRange[1] - aRange[0]) *
                   (sRange[1] - sRange[0]);        }
        i++;
    }
}


Console.WriteLine(sum);


Console.WriteLine($"{stopwatch.ElapsedMilliseconds}ms");
stopwatch.Stop();


struct Constraint
{
    public char xmas;
    public char op;
    public short val;
};

struct Condition
{
    public Constraint? constraint;
    public string destination;
};