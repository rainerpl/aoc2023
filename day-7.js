// Task Day 7: https://adventofcode.com/2023/day/7
const res = await fetch('https://adventofcode.com/2023/day/7/input');
let input = await res.text();

const ranks = {T: 10, J: 11, Q: 12, K: 13, A: 14};
const hands = input.split(/\n/gi).filter(v => v).map((row) => {
  const parts = row.split(' ');
  const handParts = parts[0]
    .split('')
    .map((v) => {
    return ranks[v] || +v;
  });
  return {cards: handParts, bid: parseInt(parts[1], 10), raw: parts[0]};
}).map((hand) => {
  const map = {};
  const cards = hand.cards;
  cards.forEach((card) => {
    if (!map[card]) {
      map[card] = {card: card, power: 1};
    } else {
      map[card].power += 1;
    }
  });
  hand.type = 0;
  hand.wildcards = hand.cards.filter(v => v === 11).length;
  Object.keys(map).forEach((mapCard) => {
    const power = map[mapCard].power;
    const card = map[mapCard].card;
    if (hand.type < 6 && power === 5) {
      hand.type = 6;
    } else if (hand.type < 5 && power === 4) {
      hand.type = 5;
    } else if (hand.type < 3 && power === 3) {
      hand.type = 3;
    }
    hand.pairs = hand.pairs || [];
    if (power === 2) {
      hand.pairs.push(card);
    }
  });
  if (hand.pairs.length) {
    if (hand.type < hand.pairs.length) {
      hand.type = hand.pairs.length;
    }
    if (hand.type === 3) {
      // pair with a tripplet gives a house
      if (hand.type < 4) {
        hand.type = 4;
      }
    }
  }
  return hand;
}).map((hand) => {
  /* Part 2 - distribute wildcards the lazy way
  */
  let wildcards = hand.wildcards;
  if (!wildcards) {
    return hand;
  }
  const spendWildCard = () => {
    if (hand.type === 0) {
      return hand.type += 1;
    } else if (hand.type === 1) {
      if (wildcards === 2) {
        // extra wildcard is wasted
        return hand.type;
      } else {
        return hand.type += 2;
      }
    } else if (hand.type === 2) {
      // two pairs
      if (wildcards > 1) {
        return hand.type += 1;
      } else {
        return hand.type += 2;
      }
    } else if (hand.type === 3) {
      if (wildcards === 1 || wildcards === 3) {

      }
      hand.type = 5;
      wildcards = 0;
    } else {
      hand.type = 6;
      wildcards = 0;
    }
  }
  while (wildcards > 0) {
    spendWildCard(spendWildCard);
    wildcards--;
  }
  if (hand.type > 6) {
    hand.type = 6;
  }
  return hand;
}).sort((hand1, hand2) => {
  const sortByCards = (hand1, hand2) => {
    let i;
    for (i = 0; i < 5; i++) {
      const c1 = hand1.cards[i] === 11 ? 1 : hand1.cards[i];
      const c2 = hand2.cards[i] === 11 ? 1 : hand2.cards[i];
      if (c1 > c2) {
        return 1;
      } else if (c1 < c2) {
        return -1;
      }
    }
    return 0;
  }
  if (hand1.type > hand2.type) {
    return 1;
  } else if (hand1.type < hand2.type) {
    return -1;
  }
  // sort all individual cards.
  return sortByCards(hand1, hand2);
});
const calcAnswer = (handsRanked) => {
  let answer = 0;
  handsRanked.forEach((hand, index) => {
    answer += (index + 1) * hand.bid
  });
  return answer;
}
console.log('answer', calcAnswer(hands));
// 248029057 answer
