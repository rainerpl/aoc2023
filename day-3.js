/*
* Task: https://adventofcode.com/2023/day/3#part1
* */

// Solution part 1
/*
const res = await fetch('https://adventofcode.com/2023/day/3/input');
let input = await res.text();
const inputWithoutNL = input.replaceAll(/\n/g, '');
let inputRows = input.split(/\n/);
let nrCols = inputRows[0].length;
const matches = [];
let number = [];
let validatedBy;
inputWithoutNL.split('').forEach((char, index) => {
  const row = Math.floor(index / nrCols);
  const col = index - (nrCols * row);
  const lastChar = Math.floor((index + 1) / nrCols) !== row;
  if (lastChar) {
    number.push(char);
  }
  if (!char.match(/[0-9]/) || lastChar) {
    if (validatedBy && number.length) {
      matches.push({nr: number.join(''), validatedBy});
    }
    number = [];
    validatedBy = false;
    return;
  } else {
    number.push(char);
  }
  const nearbyChars = {
    above: [col, row - 1],
    below: [col, row + 1],
    left: [col - 1, row],
    right: [col + 1, row],

    aboveRight: [col + 1, row - 1],
    belowRight: [col + 1, row + 1],
    aboveLeft: [col - 1, row - 1],
    belowLeft: [col - 1, row + 1],
  };
  const nearbySymbols = Object.values(nearbyChars).map((nearbyXY) => {
    const col = nearbyXY[0];
    const row = nearbyXY[1];
    return inputWithoutNL.charAt(col + row * nrCols);
  }).filter(c => c && c.match(/[^0-9.\n]+/));
  if (nearbySymbols.length) {
    validatedBy = nearbySymbols[0];
  }
});
console.log('answer', matches.reduce((sum, match) => {return sum + parseInt(match.nr, 10)}, 0));

* */

// Modified code for Part 2
const res = await fetch('https://adventofcode.com/2023/day/3/input');
let input = await res.text();
const inputWithoutNL = input.replaceAll(/\n/g, '');
let inputRows = input.split(/\n/);
let nrCols = inputRows[0].length;
const matches = [];
let number = [];
let validatedBy;
inputWithoutNL.split('').forEach((char, index) => {
  const row = Math.floor(index / nrCols);
  const col = index - (nrCols * row);
  if (!char.match(/[0-9]/)) {
    if (validatedBy && number.length) {
      matches.push({nr: number.join(''), validatedBy});
    }
    number = [];
    validatedBy = false;
    return;
  } else {
    number.push(char);
  }
  const nearbyChars = {
    above: [col, row - 1],
    below: [col, row + 1],
    left: [col - 1, row],
    right: [col + 1, row],

    aboveRight: [col + 1, row - 1],
    belowRight: [col + 1, row + 1],
    aboveLeft: [col - 1, row - 1],
    belowLeft: [col - 1, row + 1],
  };

  Object.values(nearbyChars).forEach((nearbyXY) => {
    const col = nearbyXY[0];
    const row = nearbyXY[1];
    if (inputWithoutNL.charAt(col + row * nrCols) === '*') {
      validatedBy = col + ':' + row;
    }
  });
});

const gearParts = {};
matches.forEach(({nr, validatedBy}) => {
  nr = parseInt(nr, 10)
  if (!gearParts[validatedBy]) {
    gearParts[validatedBy] = [];
  }
  gearParts[validatedBy].push(nr);
});
const answer = Object.values(gearParts)
  .filter(parts => parts.length > 1)
  .map(p => p[0] * p[1])
  .reduce((sum, v) => {return sum + v}, 0);
console.log('answer', answer);
