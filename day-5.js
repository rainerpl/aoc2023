/*
const res = await fetch('https://adventofcode.com/2023/day/5/input');
let input = await res.text();
const mapParts = [...input.matchAll(/([a-zA-Z-]+)([ map:]+)([\n0-9 ]+)/gi)];
const seeds = mapParts.splice(0, 1)[0][3].match(/[0-9]+/g).map(s => +s);
const conversionMaps = {};
mapParts.forEach((parts) => {
  const conversionMapRanges = [];
  const mapValueParts = parts[3].split('\n').forEach((partStr) => {
    if (!partStr) {return};
    const partNumbers = partStr.match(/[0-9]+/g).map(s => +s);
    const range = partNumbers[2];
    const conversionMap = {};
    conversionMap.destinationStart = partNumbers[0];
    conversionMap.destinationEnd = conversionMap.destinationStart + (range - 1);
    conversionMap.sourceStart = partNumbers[1];
    conversionMap.sourceEnd = conversionMap.sourceStart + (range - 1);
    conversionMap.range = range;
    conversionMapRanges.push(conversionMap);
  });
  conversionMaps[parts[1]] = conversionMapRanges;
});
const convertSrcToDest = (srcNr, conversionMap) => {
  const validRange = conversionMap.find((range) => {
    return range.sourceStart <= srcNr && range.sourceEnd >= srcNr
  });
  if (!validRange) {
    return srcNr;
  }
  return validRange.destinationStart + (srcNr - validRange.sourceStart);
}
const conversionMapNames = Object.keys(conversionMaps);
const seedLocations = seeds.map((seed) => {
  let currentSrc = seed;
  conversionMapNames.forEach((mapName) => {
    const conversionMap = conversionMaps[mapName];
    const newSrc = convertSrcToDest(currentSrc, conversionMap);
    // console.log('currentSrc', currentSrc, 'mapped to', newSrc);
    currentSrc = newSrc;
  });
  return {seed, location: currentSrc};
});
const sortedSeeds = seedLocations.sort((s1, s2) => {
  if (s1.location < s2.location) {
    return -1;
  } else if (s1.location > s2.location) {
    return 1;
  }
  return 0;
});
console.log('conversionMaps', conversionMaps);
*/





// ====> Part 2
const sayTheAnswer = async () => {
  const res = await fetch('https://adventofcode.com/2023/day/5/input');
  let input = await res.text();
  const startTime = Date.now();
  const mapParts = [...input.matchAll(/([a-zA-Z-]+)([ map:]+)([\n0-9 ]+)/gi)];
  const seeds = mapParts.splice(0, 1)[0][3].match(/[0-9]+/g).map(s => +s);
  const seedRanges = [];
  let i;
  for (i = 0; i < seeds.length; i+=2) {
    seedRanges.push({seed: true, start: seeds[i], end: seeds[i] + seeds[i+1] - 1});
  }
  const conversionMaps = {};
  mapParts.forEach((parts) => {
    const conversionMapRanges = [];
    parts[3].split('\n').forEach((partStr) => {
      if (!partStr) { return; }
      const partNumbers = partStr.match(/[0-9]+/g).map(s => +s);
      const range = partNumbers[2];
      const conversionMap = {};
      conversionMap.start = partNumbers[1];
      conversionMap.end = conversionMap.start + (range - 1);
      conversionMap.offset = partNumbers[0] - conversionMap.start;
      conversionMap.str = partStr;
      conversionMapRanges.push(conversionMap);
    });
    conversionMaps[parts[1]] = conversionMapRanges;
  });
  const splitSeedRange = (seedRange, mapRange) => {
    const {start, end, mapRanges} = seedRange;
    const seedRanges = [];
    const addMapRange = () => {
      seedRanges.forEach((r) => {
        if (!r.trace) {
          r.trace = seedRange.trace;
        }
        if (r.start >= mapRange.start && r.end <= mapRange.end) {
          r.map = mapRange;
          if (mapRanges) { r.mapRanges = mapRanges; }
          if (!r.mapRanges) {
            r.mapRanges = [];
          }
          r.mapRanges.push(mapRange);
        } else if (seedRanges.length > 1) {
          if (!r.mapRanges) {
            r.mapRanges = [];
          }
          r.mapRanges.push(mapRange);
        }
      });
      return seedRanges;
    }
    if ( start === end) {
      // cant split single values
      return addMapRange();
    }
    if (mapRange.start === end) {
      /*
      handle edge cases
      [------]
             [------]
       */
      seedRanges.push({start, end: end - 1});
      seedRanges.push({start: end, end});// single value, not a range
      return addMapRange();
    }
    if (mapRange.end === start) {
      /*
      handle edge cases
             [------]
      [------]
       */
      seedRanges.push({start, end: start});// single start value, not range
      seedRanges.push({start: start + 1, end});
      return addMapRange();
    }
    if (mapRange.start <= start && mapRange.end > start && mapRange.end < end) {
      /* seed start range is in the middle of map range, but seed end is off to the right
      *    [------]
      *  [------]
      * */
      seedRanges.push({start, end: mapRange.end});
      seedRanges.push({start: mapRange.end + 1, end});
      return addMapRange();
    }
    if (mapRange.start < end && mapRange.end >= end && mapRange.start > start) {
      /* break seed range which end is within map range, but start is off the map to the left
      * [-----]
      *    [--  ]
      * */
      seedRanges.push({start, end: mapRange.start - 1});
      seedRanges.push({start: mapRange.start, end: mapRange.start});
      seedRanges.push({start: mapRange.start + 1, end});
      return addMapRange();
    }
    if (mapRange.start > start && mapRange.end < end) {
      /* both seed range ends are off the map range...split seed range into 3
      * [------------] <- seed
      *    [------] <- map
      * */
      seedRanges.push({start, end: mapRange.start - 1});
      seedRanges.push({start: mapRange.start, end: mapRange.start});
      seedRanges.push({start: mapRange.start + 1, end: mapRange.end - 1});
      seedRanges.push({start: mapRange.end, end: mapRange.end});
      seedRanges.push({start: mapRange.end + 1, end});
      return addMapRange();
    }

    seedRanges.push(seedRange);
    return addMapRange();
  }

  const conversionMapNames = Object.keys(conversionMaps);
  const processOneMap = (seedRange, mapRanges) => {
    let seedRanges = [seedRange];
    let limit = 500;
    let i;
    for (i = 0; i < seedRanges.length; i++) {
      const range = seedRanges[i];
      limit--;
      if (limit < 1) { console.error('broken loop'); return; }
      mapRanges.forEach((mapRange) => {
        const splitResult = splitSeedRange(range, mapRange);
        if (splitResult.length > 1) {
          // replace currently looped range with its split up parts
          seedRanges.splice(i, 1);
          seedRanges.push(...splitResult);
        }
      });
    }
    // apply offsets for next layer that matched a range
    seedRanges.filter((r) => {
      const matches = mapRanges.filter((mrange) => {
        return mrange.start <= r.start && mrange.end >= r.end
      });
      if (matches.length > 1) {
        console.error('Number in more than one matching range', r);
      } else if (matches.length === 1) {
        r.map = matches[0];
        r.trace.push({matchedRange: matches[0]});
      }
      if (!matches.length) {
        r.trace.push({matchedRange: null});
      }
      return matches.length;
    }).forEach((range) => {
      range.start += range.map.offset;
      range.end += range.map.offset;
    });
    seedRanges.forEach((r) => {
      delete r.map;
    });
    return seedRanges;
  }
  processSeedRanges = () => {
    // ...seedRanges
    seedRanges.forEach((range) => {
      range.trace = [];
    });
    let currentSeedRanges = [...seedRanges];
    let nextLayerRanges = [];

    conversionMapNames.forEach((mapName) => {
      const conversionMap = conversionMaps[mapName];
      currentSeedRanges.forEach((seedRange) => {
        const splitResult = processOneMap(seedRange, conversionMap);
        nextLayerRanges.push(...splitResult);
      });
      currentSeedRanges = nextLayerRanges;
      nextLayerRanges = [];
    })
    return currentSeedRanges;
  };
  let result = processSeedRanges();
  result = result.sort((s1, s2) => {
    if (s1.start < s2.start) {return -1}
    if (s1.start > s2.start) {return + 1}
    return 0;
  });
  console.log('Result', result[0].start, 'time', Date.now() - startTime, 'milliseconds');
}
sayTheAnswer();
// Result 4917124 time 35 milliseconds
