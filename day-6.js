// Both parts are basically the same for this task, so...
const races = [{time: 44826981, record: 202107611381458}];
//const races = [{time: 44, record: 202}, {time: 82, record: 1076}, {time: 69, record: 1138}, {time: 81, record: 1458}];

const processRace = ({time, record}) => {
  let i;
  const possibleWins = [];
  for (i = 1; i < time; i++) {
    const timeLeft = time - i;
    if (i * timeLeft > record) {
      possibleWins.push(i);
    }
  }
  return possibleWins;
}
let answer = races.map(processRace).map(r => r.length).reduce((total, v) => {return total * v}, 1)
console.log('answer', answer);
