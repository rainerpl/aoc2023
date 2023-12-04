/*
* Task: https://adventofcode.com/2023/day/2#part2
* */

/*
* // Game part 1 before modifying it for part 2

const res = await fetch('https://adventofcode.com/2023/day/2/input');
const input = await res.text();
const gamesRows = input.split(/\n/gi).filter(v => v);
const maxColorLimits = {red: 12, green: 13, blue: 14};
const gameColors = Object.keys(maxColorLimits);
let sumOfIds = 0;
gamesRows.forEach((row) => {
  const gameId = parseInt(row.match(/Game *([0-9]+)/i)[1], 10);
  const reveals = row.split(':')[1].split(';');
  let maxColors = {red: 0, green: 0, blue: 0};
  reveals.forEach((reveal) => {
    reveal = [...reveal.matchAll(/([0-9]+) *(blue|red|green)/gi)];
    reveal.forEach((cube) => {
      const nr = parseInt(cube[1], 10);
      const color = cube[2];
      if (maxColors[color] < nr) {
        maxColors[color] = nr;
      }
    });
  });
  const colorsWithinLimit = gameColors.filter((color) => {
    return maxColorLimits[color] >= maxColors[color]
  }).length;
  if (colorsWithinLimit === gameColors.length) {
    sumOfIds += gameId;
  }
});
console.log('sumOfIds', sumOfIds);
* */

// Part 2 solution.
const res = await fetch('https://adventofcode.com/2023/day/2/input');
let input = await res.text();
const gamesRows = input.split(/\n/gi).filter(v => v);
let sumOfPower = 0;
gamesRows.forEach((row) => {
  const reveals = row.split(':')[1].split(';');
  let maxColors = {red: 0, green: 0, blue: 0};
  reveals.forEach((reveal) => {
    reveal = [...reveal.matchAll(/([0-9]+) *(blue|red|green)/gi)];
    reveal.forEach((cube) => {
      const nr = parseInt(cube[1], 10);
      const color = cube[2];
      if (maxColors[color] < nr) {
        maxColors[color] = nr;
      }
    });
  });
  sumOfPower += Object.values(maxColors).reduce((total, value) => {return total * value}, 1);
});
console.log('sumOfPower', sumOfPower);
