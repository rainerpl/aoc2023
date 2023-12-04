// Task 1
/*
const res = await fetch('https://adventofcode.com/2023/day/4/input');
let input = await res.text();
inputX = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

const cards = [...input.matchAll(/Card ([0-9]+):([0-9 ]+) +\| +([0-9 ]+)/gi)];
const strToNr = str => str.split(' ').map((n) => {return parseInt(n, 10);}).filter(v => v);
let totalScore = 0;
cards.forEach((cardRow) => {
  const cardId = cardRow[1];
  const cardNumbers = strToNr(cardRow[2]);
  const winningNumbers = strToNr(cardRow[3]);
  const matchingNumbers = winningNumbers.filter(winNr => cardNumbers.includes(winNr));
  const ticketScore = Math.floor(Math.pow(2, matchingNumbers.length - 1));
  totalScore += ticketScore;
  console.log(cardId, cardNumbers, winningNumbers, matchingNumbers, ticketScore);
});
console.log('Ticket Score', totalScore);
*/





// Task part 2
const res = await fetch('https://adventofcode.com/2023/day/4/input');
let input = await res.text();
const cards = [...input.matchAll(/Card +([0-9]+):([0-9 ]+) +\| +([0-9 ]+)/gi)];
const strToNr = str => str.split(' ').map((n) => {return parseInt(n, 10);}).filter(v => v);
const tickets = [];
const ticketsById = {};
cards.forEach((cardRow) => {
  const cardId = parseInt(cardRow[1], 10);
  const cardNumbers = strToNr(cardRow[2]);
  const winningNumbers = strToNr(cardRow[3]);
  const matchingNumbers = winningNumbers.filter(winNr => cardNumbers.includes(winNr));
  const ticket = {id: cardId, matchingNumbers: matchingNumbers.length, nrCopies: 0};
  ticketsById[cardId] = ticket;
  tickets.push(ticket);
});
tickets.forEach((ticket) => {
  if (!ticket.matchingNumbers) {return;}
  let i;
  for (i = ticket.id; i < ticket.id + ticket.matchingNumbers; i++) {
    const ticketToCopy = ticketsById[i + 1];
    if (!ticketToCopy) {break;}
    ticketToCopy.nrCopies += 1 + ticket.nrCopies;
  }
});
console.log('Answer', tickets.reduce((sum, ticket) => {return sum + 1 + ticket.nrCopies}, 0));
