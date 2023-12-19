const res = await fetch('https://adventofcode.com/2023/day/12/input');
input = await res.text();

//input = '?????.??#????? 3,4';
input = '.??..??...?##. 1,1,3';
const rows = input.split(/\n/gi).filter(v => v);
let part2 = false;
const splitStr = (str) => {
    let parts = str.split(' ');
    const groups = parts[1].split(',').map(v => +v);
    const pattern = parts[0].split('');
    if (part2) {
        let i;
        const startGroups = groups.slice();
        const startPattern = pattern.slice();
        for (i = 0; i < 4; i++) {
            groups.push(...startGroups);
            pattern.push('?', ...startPattern);
        }
    }

    const cache = {};
    const countArrangements = (pattern, groups) => {
        const cacheKey = pattern.join('') + ':' + groups.join('');
        if (cache[cacheKey] !== undefined) { return cache[cacheKey];}
        if (!groups.length) {
            if (pattern.includes('#')) {
                return 0;
            }
            return 1;
        }
        if (!pattern.length) {
            if (!groups.length) {
                return 1;
            }
            return 0;
        }

        let result = 0;
        if (['.', '?'].includes(pattern[0])) {
            const subPattern = pattern.slice(1);
            let recursionResult = countArrangements(subPattern, groups);
            result += recursionResult;
        }
        if (
            ['#', '?'].includes(pattern[0]) &&
            groups[0] <= pattern.length &&
            !pattern.slice(0, groups[0]).includes('.') &&
            ( groups[0] === pattern.length || pattern[groups[0]] !== '#')
        ) {
            const subPattern = pattern.slice(groups[0] + 1);
            const subGroups = groups.slice(1);
            let recursionResult = countArrangements(subPattern, subGroups);
            result += recursionResult;

        }
        cache[cacheKey] = result;
        return result;
    }

    return countArrangements(pattern, groups);
}
let results = rows.map(splitStr);
console.log('Part 1 Answer:', results.reduce((total, v) => {
    return total + v;
}, 0));
part2 = true;
results = rows.map(splitStr);
console.log('Part 2 Answer:', results.reduce((total, v) => {
    return total + v;
}, 0));
