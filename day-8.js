const res = await fetch('https://adventofcode.com/2023/day/8/input');
let input = await res.text();
input = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;
const rows = input.split(/\n/gi).filter(v => v);
const instructions = rows[0].split('');
const nodes = {};
let currentInstructionIndex = 0;
let currentInstruction = instructions[currentInstructionIndex];
let nrSteps = 0;
rows.slice(1).forEach((row, index) => {
    row = [...row.matchAll(/([0-9A-Za-z]+) *= *\(([0-9A-Za-z]+), *([0-9A-Za-z]+)\)/gi)][0];
    if (nodes[row[1]]) {console.error('node duplicate', nodes[row[1]]);}
    nodes[row[1]] = {node: row[1], L: row[2], R: row[3], count: 0};
});
let startingNodes = Object.values(nodes).filter(node => node.node[2] === 'A');
const targetNode = nodes['ZZZ'];
const resolvePath = (currentNode, endNodeTest) => {
    const path = [];
    path.loopbacks = {};
    currentInstructionIndex = 0;
    let killSwitch = 10000000;
    let loopInstructions = [];
    currentNode.count += 1;
    while (killSwitch > 0) {
        killSwitch--;
        if (!instructions[currentInstructionIndex]) {
            currentInstructionIndex = 0;
        }
        currentInstruction = instructions[currentInstructionIndex];
        loopInstructions.push(currentInstruction);
        const nextNode = nodes[currentNode[currentInstruction]];
        const isShortcut = false;
        if (isShortcut) {
            // step out or shortcut
        } else {
            // step onto next node
            const pathStep = {node: currentNode.node, dir: currentInstruction, nextNode: nextNode.node};
            path.push(pathStep); // ToDo - exclude final loop node
            currentNode = nextNode;
            currentNode.count += 1;
            //console.log('inc', currentNode.node, currentNode.count, currentInstruction);
            if (currentNode.count > 1) {
                if(!path.loopbacks[currentNode.node]) {
                    path.loopbacks[currentNode.node] = [];
                }
                path.loopbacks[currentNode.node].push(loopInstructions.join());
                loopInstructions = [];
            }

        }
        nrSteps += 1;
        if (endNodeTest(currentNode)) {
            break;
        }
        currentInstructionIndex++;
    }
    return path;
}
//path = resolvePath(nodes['AAA'], (currentNode) => currentNode.node === targetNode.node);
const individualPaths = startingNodes.map((startingNode) => {
    return resolvePath(startingNode, (currentNode) => currentNode.node[2] === 'Z');
});

solvePath = (longerPath, shorterPath) => {
    let killSwitch = 100000000;
    let currentIndex = 0;
    let nrIterations = 1;
    while (killSwitch > 0) {
        killSwitch--;
        const node = longerPath[currentIndex];
        nrIterations += 1;
        if (node.nextNode[2] === 'Z') {
            break;
        }
        if (currentIndex + shorterPath.length > longerPath.length - 1) {
            const nextIndex = currentIndex + shorterPath.length;
            currentIndex = Math.abs(nextIndex - (longerPath.length - 1));
        } else {
            currentIndex += shorterPath.length;
        }
    }
    if (killSwitch < 1) {console.error('need more brute force :)');}
    console.log('resolved after', nrIterations);
    return nrIterations * shorterPath.length;
}
// answer 12324145107121
const individualPathsSorted = individualPaths.sort();
const values = individualPathsSorted.map((p) => {
    return {len: p.length, iters: p.nrIterations }
});
let killSwitch = 400000000;
let largestLength = values[ values.length - 1].len;
let currentItteration = largestLength;
while (killSwitch > 0) {
    killSwitch--;
    const invalidLengths = values.filter(({len}) => {
        return currentItteration % len !== 0;
    });
    if (!invalidLengths.length) {
        // found common multiplier
        console.log('Answer Is:', currentItteration);
        break;
    }
    currentItteration += largestLength;
}
if (killSwitch < 1) {console.error('need more brute force :)');}

