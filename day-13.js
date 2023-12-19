
const processInput = (input) => {
    return input.split(/\n\n/gi).filter(v => v).map((patternStr) => {
        let i;
        const rows = patternStr.split(/\n/gi).map(row => row.split('').filter(v => v)).filter(v => v);
        const cols = [];
        const nrCols = rows[0].length;
        for (i = 0; i < nrCols; i++) {
            const col = [];
            rows.forEach((row) => {
                col.push(row[i]);
            });
            cols.push(col);
        }
        return {
            rows: rows.filter(v => v),
            cols: cols.filter(v => v),
        };
    });
}
const getAnswer = async () => {
    const res = await fetch('https://adventofcode.com/2023/day/13/input');
    let input = await res.text();
    const patterns = processInput(input);
    const processPattern = (pattern, patternIndex) => {
        const compareLines = (line1, line2, smudgesLeft) => {
            let i;
            let smudgeIndex;
            for (i = 0; i < line1.length; i++) {
                if (line1[i] !== line2[i]) {
                    if (smudgesLeft) {
                        smudgesLeft--;
                        smudgeIndex = i;
                        continue;
                    }
                    return {result: false, smudgesLeft, smudgeIndex};
                }
            }
            return {result: true, smudgesLeft, smudgeIndex};
        }
        const findStartingLine = (lines, startingIndex) => {
            let i;
            const searchLines = lines.slice(startingIndex);
            for (i = 1; i < searchLines.length; i++) {
                const line1 = searchLines[i - 1];
                const line2 = searchLines[i];
                if (!line1 || !line2) {
                    return false;
                }
                const res = compareLines(line1, line2, 1);
                if (res.result) {
                    return {
                        minIndex: startingIndex + (i - 1),
                        maxIndex: startingIndex + i,
                        line1,
                        line2,
                        lines,
                        smudgesLeft: res.smudgesLeft,
                    }
                }
            }
            return false;
        }
        const findHorizontalStartingLine = (startingIndex) => {
            return findStartingLine(pattern.rows, startingIndex);
        }
        const findVerticalStartingLine = (startingIndex) => {
            return findStartingLine(pattern.cols, startingIndex);
        }
        const expandStartingLine = (lineData) => {
            let smudgesLeft = lineData.smudgesLeft;
            if (!lineData || !lineData.lines) {
                return false;
            }
            const lines = lineData.lines;
            const reflectedLinesMin = []; // min = left or up direction
            const reflectedLinesMax = []; // max = right or down
            let minIndex = lineData.minIndex;
            let maxIndex = lineData.maxIndex;
            let killSwitch = 1000;
            while (killSwitch > 0) {
                killSwitch -= 1;
                minIndex--;
                maxIndex++;
                const lineMin = lines[minIndex];
                const lineMax = lines[maxIndex];
                if (!lineMin || !lineMax) {
                    // reached the end, all lines matched until one went off the map.
                    if (smudgesLeft !== 0) {
                        // all mirrors must have 1 smudge used up...if not, then it's not valid.
                        return false;
                    }
                    return {reflectedLinesMin, reflectedLinesMax}
                }
                const res = compareLines(lineMin, lineMax, smudgesLeft);
                smudgesLeft = res.smudgesLeft;
                if ( res.result ) {
                    reflectedLinesMin.push(lineMin);
                    reflectedLinesMax.push(lineMax);
                } else {
                    return false;
                }
            }
            return false;
        }
        let answer = 0;
        let killSwitch = 100;
        let horizontalDone = false;
        let verticalDone = false;
        let horizontalStartIndex = 0;
        let verticalStartIndex = 0;
        while (killSwitch > 0) {
            killSwitch--;
            if (!horizontalDone) {
                const horizontalLine = findHorizontalStartingLine(horizontalStartIndex);
                if (horizontalLine) {
                    const expandResult = expandStartingLine(horizontalLine);
                    if (expandResult) {
                        answer += horizontalLine.maxIndex * 100;
                    }
                    horizontalStartIndex = horizontalLine.maxIndex;
                } else {
                    horizontalDone = true;
                }
            }
            if (!verticalDone) {
                const verticalLine = findVerticalStartingLine(verticalStartIndex);
                if (verticalLine) {
                    const expandResult = expandStartingLine(verticalLine);
                    if (expandResult) {
                        answer += verticalLine.maxIndex;
                    }
                    verticalStartIndex = verticalLine.maxIndex;
                } else {
                    verticalDone = true;
                }
            }
            if (horizontalDone && verticalDone) {
                break;
            }
            if (killSwitch < 2) {
                console.error('Error: killswitch')
            }
        }
        return answer;
    }

    const patternValues = patterns.map(processPattern);
    console.log('Answer:', patternValues.reduce((total, v) => {
        return total + v;
    }, 0));
}

getAnswer();
