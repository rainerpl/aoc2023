/*
* Day 10
* "...The landscape here is alien; even the flowers and trees are made of metal. As you stop to admire some metal grass"
* ToDo: figure out how the f*** did that little elf not shred his feet on metal blades of grass.
* */
/*
| is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
*/

const getAnswerPart1 = async () => {
    // Gets answer for part 1...part of which also works for part 2
    const res = await fetch('https://adventofcode.com/2023/day/10/input');
    let input = await res.text();
    const rows = input.split(/\n/gi);

    const grid = {};
    const distances = [];
    rows.forEach((row, rowIndex) => {
        const letters = row.split('');
        distances.push([]);
        letters.forEach((letter, colIndex) => {
            distances[distances.length - 1].push(0);
            if (letter === '.') {return ;}
            grid[colIndex + ':' + rowIndex] = {letter, colIndex, rowIndex};
        });
    });
    const canConnect = (p1, p2) => {
        if (!p1 || !p2) {
            return false;
        }
        const l1 = p1.letter;
        const l2 = p2.letter;
        const horizontalDiff = p1.colIndex - p2.colIndex;
        const verticalDiff = p1.rowIndex - p2.rowIndex;
        const canConnectToRight = ['-', 'F', 'L', 'S'];
        const canConnectToLeft = ['-', 'J', '7', 'S'];
        const canConnectToTop = ['|', 'J', 'L', 'S'];
        const canConnectToBottom = ['|', 'F', '7', 'S'];

        if (Math.abs(horizontalDiff) + Math.abs(verticalDiff) > 1) {
            return false;
        }
        if (!horizontalDiff) {
            // vertical connections only
            if (verticalDiff < 0) {
                // p1 is top and needs to connect to bottom
                return canConnectToBottom.includes(l1) && canConnectToTop.includes(l2)
            } else {
                return canConnectToBottom.includes(l2) && canConnectToTop.includes(l1)
            }
        } else if (!verticalDiff) {
            // horizontal connectors only
            if (horizontalDiff < 0) {
                // p1 is left and needs to connect to right
                return canConnectToRight.includes(l1) && canConnectToLeft.includes(l2)
            } else {
                return canConnectToRight.includes(l2) && canConnectToLeft.includes(l1)
            }
        }
        return false;
    }
    let startingNode;
    Object.values(grid).forEach((pipe) => {
        const {colIndex, rowIndex} = pipe;
        pipe.leftNode = grid[(colIndex - 1) + ':' + rowIndex];
        pipe.rightNode = grid[(colIndex + 1) + ':' + rowIndex];
        pipe.upNode = grid[colIndex + ':' + (rowIndex - 1)];
        pipe.downNode = grid[colIndex + ':' + (rowIndex + 1)];
        if (pipe.letter === 'S') {
            startingNode = pipe;
        }
        // delete pipes that have less than 2 connections right away
        const nrConnections = ['left', 'right', 'up', 'down'].filter((direction) => {
            const adjacentNode = pipe[direction + 'Node'];
            const connected = adjacentNode && canConnect(pipe, adjacentNode);
            if (!connected) {
                delete pipe[direction + 'Node'];
            }
            return connected;
        }).length;
        if (nrConnections < 2) {
            rows[rowIndex][colIndex] = 'x';
            grid[colIndex + ':' +rowIndex] = '.';
        }
    });
    const calculateDistances = () => {
        let kill = 20000;
        let currentDist = 0;
        startingNode.dist = currentDist;
        let pipeEnds = [startingNode];
        while (kill > 0) {
            kill--;
            const newPipeEnds = [];
            pipeEnds.forEach((pipe) => {
                if (typeof pipe.dist === 'undefined') {
                    pipe.dist = currentDist;
                    distances[pipe.rowIndex][pipe.colIndex] = pipe.dist;
                }
                ['left', 'right', 'up', 'down'].forEach((direction) => {
                    const adjacentPipe = pipe[direction + 'Node'];
                    if (adjacentPipe && adjacentPipe.dist === undefined) {
                        newPipeEnds.push(adjacentPipe);
                    }
                })
            });
            if (!newPipeEnds.length) {
                console.log('Part 1 Answer IS:', currentDist);
                return;
            }
            currentDist++;
            pipeEnds = newPipeEnds;
        }
        if (kill < 1) {
            console.warn('Need more brute force maybe?');
        }
    }
    calculateDistances();

    return {grid, distances, startingNode};
}

getAnswerPart1().then(({grid, distances, startingNode}) => {
    // replace starting node 0 with *, so we don't have a whole in the loop.
    distances[startingNode.rowIndex][startingNode.colIndex] = 1;
    let wallMap = distances.map((row, rowIndex) => {
        return row.map((dist, colIndex) => {
            const pipe = grid[colIndex + ':' + rowIndex];
            if (pipe === undefined) {
                // no value in grid - this is not a pipe
                return 'x';
            }
            const letter = pipe.letter;
            if (dist > 0) {
                // letter === '-' || letter === '|' &&
                // Replace S with a valid piece to close the loop.
                if (letter === 'S') {
                    console.warn('Hard coded solution since i\'m lazy: S replaced with F');
                    grid[colIndex + ':' + rowIndex].letter = 'F';
                    return 'F';
                }
                return letter;
            } else if (dist > 0) {
                // rest of the wall blocks are irrelevant
                return '*';
            }
        });
    });
    const getPipesOnALine = ({rowChange, colChange, rowIndex, colIndex, symbol}) => {
        let kill = 1000;
        rowChange = rowChange || 0;
        colChange = colChange || 0;
        let pipes = [];
        while (kill > 0) {
            kill--;
            rowIndex += rowChange;
            colIndex += colChange;
            const distRow = distances[rowIndex];
            if (!distRow) {
                break;
            }
            const dist = distRow[colIndex];
            if (dist === undefined) {
                break;
            } else if (dist > 0) {
                // this filters out non-main-loop-pipes
                const pipe = grid[colIndex + ':' + rowIndex];

                if (pipe) {
                    pipes.push(pipe);
                }
            }
        }
        return pipes;
    }
    let tilesInside = [];
    wallMap.forEach((wallRow, rowIndex) => {
        wallRow.forEach((dist, colIndex) => {
            const pipe = grid[colIndex + ':' + rowIndex];
            if (pipe && dist) {
                return;
            }
            /*
           * F--7
           * |  |
           * L--J
           * */
            const leftPipes = getPipesOnALine({colChange: -1, rowIndex, colIndex, symbol: '|'}).reverse();
            const rightPipes = getPipesOnALine({colChange: 1, rowIndex, colIndex, symbol: '|'});
            const countIntersections = (pipes) => {
                let pipeLetters = pipes.map(p => p.letter).join('');
                let prevLength = 0;
                for (let i = 0; i < 100; i++) {
                    if (pipeLetters.letter === prevLength) {
                        return pipeLetters;
                    }
                    pipeLetters = pipeLetters.replaceAll(/-+/gi, '-')
                        .replaceAll('||', '')
                        .replaceAll(/F-*7/gi, '')/* top down bend */
                        .replaceAll(/L-*J/gi, '')/* bottom up bend */
                        .replaceAll(/L-*7/gi, '|')
                        .replaceAll(/F-*J/gi, '|');
                    prevLength = pipeLetters.letter;
                }
                return pipeLetters;
            }
            const leftIntersectionNr = countIntersections(leftPipes, '|').length;
            const rightIntersectionNr = countIntersections(rightPipes, '|').length;
            const horizontalIn = ( leftIntersectionNr && leftIntersectionNr % 2 !== 0) && ( rightIntersectionNr && rightIntersectionNr % 2 !== 0);
            if ( horizontalIn) {
                wallMap[rowIndex][colIndex] = 'Z';
                tilesInside.push({colIndex, rowIndex, dist, leftPipes: leftPipes.map(p => p.letter), rightPipes: rightPipes.map(p => p.letter)});
            }
        })
    });
    // Just to see a prettier map.
    wallMap = wallMap.map((row) => {
        return row.map(r => r === undefined ? 'x' : r);
    });
    console.log('Answer to part 2 is:', tilesInside.length, 'wallMap', wallMap);
});
