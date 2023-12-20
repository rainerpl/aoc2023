const processInput = async () => {
    let i;
    const res = await fetch('https://adventofcode.com/2023/day/15/input');
    let input = await res.text();
    return input
        .replace(/\n/gi, '')
        .split(/ *, */gi)
        .filter(v => v);
}
const hashMap = [];
const charToValue = (char, prevValue) => ((prevValue + char.charCodeAt(0)) * 17) % 256;
const stringToValue = (str) => {
    let value = 0;
    let i;
    for (i = 0; i < str.length; i++) {
        value = charToValue(str[i], value);
    }
    return value;
}

const getLensByLabel = (box, label) => {
    if (!box || !box.length) { return ;}
    let i;
    for (i = 0; i < box.length; i++) {
        if (box[i].label === label) {
            return {
                lens: box[i],
                index: i,
            }
        }
    }
}
const processAssignment = (instruction) => {
    const {boxNr} = instruction;
    let box = hashMap[boxNr];
    if (!box) {
        hashMap[boxNr] = [instruction];
        return;
    }
    const existingLens = getLensByLabel(box, instruction.label);
    if (!existingLens) {
        box.push(instruction);
        return;
    }
    box[existingLens.index] = instruction;
}
const processRemoval = (instruction) => {
    const {label, focalLength, boxNr} = instruction;
    let box = hashMap[boxNr];
    if (!box) {
        return ;
    }
    const existingLens = getLensByLabel(box, instruction.label);
    if (!existingLens) {
        return ;
    }
    box.splice(existingLens.index, 1);
}

const processInstruction = (instruction) => {
    const {label, operand, focalLength} = instruction;
    if (operand === '=') {
        return processAssignment(instruction);
    } else if (operand === '-') {
        return processRemoval(instruction);
    }
    throw new Error('Invalid operand');
}
const getAnswer = async () => {
    const rows = await processInput();
    const values = rows.map(stringToValue);
    const instructions = rows.map((str) => {
        const parts = str.split(/[=\-]/gi);
        return {
            label: parts[0],
            operand: str[parts[0].length],
            focalLength: +parts[1],
            boxNr: stringToValue(parts[0]),
        }
    });
    instructions.forEach(processInstruction);
    let valueSum = values.reduce((total, v) => {
        return total + v;
    }, 0);
    console.log('Part 1 Answer:', valueSum);
    valueSum = 0;
    hashMap.forEach((box, boxNr) => {
        box.forEach((lens, index) => {
            const lensPosition = index + 1;
            //console.log('===>', boxNr, lensPosition, 'focalLength', lens.focalLength)
            valueSum += (boxNr + 1) * lensPosition * lens.focalLength;
        })
    });
    console.log('Part 2 Answer:', valueSum);
}

getAnswer();
/*
*
The current value starts at 0.
The first character is H; its ASCII code is 72.
The current value increases to 72.
*
The current value is multiplied by 17 to become 1224.
*
The current value becomes 200 (the remainder of 1224 divided by 256).
*
The next character is A; its ASCII code is 65.
The current value increases to 265.
The current value is multiplied by 17 to become 4505.
The current value becomes 153 (the remainder of 4505 divided by 256).
The next character is S; its ASCII code is 83.
The current value increases to 236.
The current value is multiplied by 17 to become 4012.
The current value becomes 172 (the remainder of 4012 divided by 256).
The next character is H; its ASCII code is 72.
The current value increases to 244.
The current value is multiplied by 17 to become 4148.
The current value becomes 52 (the remainder of 4148 divided by 256).
* */
