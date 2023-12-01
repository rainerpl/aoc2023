/*
  task: https://adventofcode.com/2023/day/1
  You try to ask why they can't just use a weather machine ("not powerful enough")
  and where they're even sending you ("the sky") and why your map looks mostly blank ("you sure ask a lot of questions")
  and hang on did you just say the sky ("of course, where do you think snow comes from")
  when you realize that the Elves are already loading you into a trebuchet ("please hold still, we need to strap you in").

  As they're making the final adjustments,
  they discover that their calibration document (your puzzle input)
  has been amended by a very young Elf who was apparently just excited to show off her art skills.
  Consequently, the Elves are having trouble reading the values on the document.

  ToDo: Find out if the trebuchet is rated for Elven flight and if the Elves have a valid trebuchet' licence.
  ToDo: Find out who was that young Elf and punish them severely. If we ignore such incompetence, then we are going
        to have similar issues throughout the month.
*/

// Part One Before Modifications For Part 2
/*
const res = await fetch('https://adventofcode.com/2023/day/1/input');
let input = await res.text();
const inputLines = input.replace(/[^0-9\n]+/g, '').split('\n');
const calibrationValues = inputLines
  .filter(v => v)
  .map(l => parseInt(l[0]+l[l.length-1], 10));
console.log('Answer:', calibrationValues.reduce((sum, value) => {return sum + value}, 0));
*/
// Part 2
const res = await fetch('https://adventofcode.com/2023/day/1/input');
let input = await res.text();

const substitutions = {one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9};
const inputLines = input.split('\n');
const calibrationValues = [];
inputLines.forEach((line) => {
  let parsedLine = [];
  Object.keys(substitutions).forEach((word) => {
    const nr = substitutions[word];
    const wordMatches = [...line.matchAll(new RegExp(word, 'gi'))];
    const numberMatches = [...line.matchAll(new RegExp(nr, 'gi'))];
    wordMatches.concat(numberMatches).forEach((match) => {
      parsedLine.push({index: match.index, value: nr});
    });
  });
  if (!parsedLine.length) {return ;}
  parsedLine = parsedLine.sort((v1, v2) => {
    if (v1.index < v2.index) {return -1;}
    if (v1.index > v2.index) {return 1;}
  });
  calibrationValues.push(parseInt(parsedLine[0].value + '' + parsedLine[parsedLine.length - 1].value, 10));
});
console.log('Answer:', calibrationValues.reduce((sum, value) => {return sum + value}, 0));
