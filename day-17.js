/*
const input = `
2119991111999
9911991991999
9991991991111
9991111999991
9999999999991
9999999991111
9999999991999
9999999111999
9999111199999
9111199999999
9199999999999
9199911191111
9111119111991
`;*/

const input = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;
const paths = {}
let nrRows;
let nrCols;
let lastTileRowNr;
let lastTileColNr;
let totalDistanceToFinish;
const cache = {};
const processInput = async () => {
    //const res = await fetch('https://adventofcode.com/2023/day/17/input');
    //let input = await res.text();
    const rows = input.split(/\n/gi).map((row) => {
        return row.split('').map(v => +v)
    }).filter(row => row.length);
    nrRows = rows.length;
    nrCols = rows[0].length;
    lastTileRowNr = nrRows - 1;
    lastTileColNr = nrCols - 1;
    totalDistanceToFinish = (lastTileRowNr + lastTileColNr);
    return rows;
}
const finishedPaths = [];
const getAnswer = async () => {
    const rows = await processInput();

    const improveExistingPath = (existingPath, betterPath, betterPathKey) => {
        const costDiff = betterPath.cost - existingPath.cost;
        // find all paths that stepped on this tile and improve their score + reactivate them if they aren't already finished.
        Object.values(paths).forEach((path) => {
            if (path === betterPath || !path.path.includes(betterPathKey)) {
                return ;
            }
            // 0:0(3)|1:0(3)|2:0(2)|2:1(3) = prev best = 19
            // 0:0(3)|0:1(3)|0:2(2)|1:2(3)|2:2(2)|2:1(3) = new best = 13
            // 0:0(3)|1:0(3)|2:0(2)|2:1(3)|3:1(3) = 14
            let remainingPath = path.path.split(betterPathKey)[1];
            let newPath;
            if (!remainingPath) {
                // full path replacement
                newPath = betterPath.path;
            } else {
                newPath = betterPath.path + remainingPath;
            }
            path.cost += costDiff;
            path.path = newPath;
            const distanceGained = totalDistanceToFinish - ((lastTileRowNr - path.rowNr) + (lastTileColNr - path.colNr));
            //path.evaluated = false;
            //console.log('path includes key', path, betterPathKey, 'efficiencyImprovement', existingPath, betterPath, 'newPath', newPath);
        });
    }
    const advancePath = (path) => {
        /*
        if (path.colNr === 1 && path.rowNr === 12) {
            console.log('x');
        }*/
        //if (path.path === '0:0(3)|1:0(3)|2:0(2)|2:1(3)|3:1(3)|3:2(3)|3:3(2)|2:3(3)') {
            // 0:0(3)|1:0(3)|2:0(2)|2:1(3)|3:1(3)
            // 0:0(3)|1:0(3)|2:0(2)|2:1(3)|3:1(3)|3:0(3)|2:0(3)|1:0(2)
            //console.log('advancePath');
        //}
        let newPathsAdded = 0;
        if (!path || (path.finished || path.evaluated)) {
            return;
        }
        // console.log('advancePath', path.colNr, path.rowNr);
        path.evaluated = true;
        if (path.rowNr === lastTileRowNr && path.colNr === lastTileColNr) {
            // console.log('Path is done:');
            finishedPaths.push(path);
            path.finished = true;
        }
        const top = {colNr: path.colNr, rowNr: path.rowNr - 1};
        const bottom = {colNr: path.colNr, rowNr: path.rowNr + 1};
        const left = {colNr: path.colNr - 1, rowNr: path.rowNr};
        const right = {colNr: path.colNr + 1, rowNr: path.rowNr};

        [top, bottom, left, right].filter((tile) => {
            const row = rows[tile.rowNr];
            if (!row) {
                return false;
            }
            tile.prevColNr = path.colNr;
            tile.prevRowNr = path.rowNr;
            /*
            if (rows[tile.rowNr][tile.colNr] === 1) {

            }*/
            const value = row[tile.colNr];

            if (value === undefined || (tile.colNr === path.prevColNr && tile.rowNr === path.prevRowNr)) {
                // tile is off map or going back where it came from.
                return false;
            }

            const tileChangeX = tile.colNr - path.colNr;
            const tileChangeY = tile.rowNr - path.rowNr;

            const prevChangeX = path.colNr - path.prevColNr;
            const prevChangeY = path.rowNr - path.prevRowNr;
            const movingStraight = (tileChangeX === prevChangeX || tileChangeY === prevChangeY);
            if (!movingStraight && path.path !== '0:0(3)') {
                // every turn resets the counter | starting tile = always moving straight, so we start counting right away
                tile.stepsRemaining = 3;
            } else {
                tile.stepsRemaining = path.stepsRemaining - 1;
                //console.log('tile.stepsRemaining', path.stepsRemaining);
            }
            if (tile.stepsRemaining < 0) {
                throw new Error('Invalid nr of steps');
            }
            if (tile.stepsRemaining === 0) {
                // must change direction.
                if ( movingStraight ) {
                    //console.log('must change direction at', path, tile);
                    return false;
                }
            }
            return true;
        }).forEach((tile) => {
            tile.costCorrections = path.costCorrections || [];
            tile.length = path.length + 1;
            const pathKey = tile.colNr + ':' + tile.rowNr + '(' + tile.stepsRemaining + ')';
            tile.path = path.path + '|' + pathKey ;

            /*
            if (pathKey === '2:0') {
                console.log('must change direction at');
            }*/
            // prevColNr
            tile.cost = path.cost + rows[tile.rowNr][tile.colNr];
            //const distanceGained = totalDistanceToFinish - ((lastTileRowNr - tile.rowNr) + (lastTileColNr - tile.colNr));
            // check if we ran into another path. If so, check if this path is more efficient. If so, replace existing path.
            // Todo: if this doesnt work, also consider how many steps both paths have left. If we land on this tile and
            // have 0 forward steps remaining vs another path that has 3 left, then that path might still turn out better.

            const existingPath = paths[pathKey];
            if (!existingPath) {
                paths[pathKey] = tile;
                newPathsAdded += 1;
            } else {
                // existing path - 0:0(3)|1:0(3)|2:0(2)|2:1(3)|3:1(3) - diff = 1,
                // 0:0(3)|1:0(3)|2:0(2)|2:1(3)|3:1(3)|3:2(3)
                /*
                const modifiedFinishedPath = finishedPaths.filter((fpath) => {
                    return fpath.path.includes(pathKey)
                });
                if (modifiedFinishedPath.length) {
                    console.log('modifiedFinishedPath', modifiedFinishedPath)
                }*/
                if (existingPath.cost > tile.cost || existingPath.cost === tile.cost && tile.stepsRemaining > existingPath.stepsRemaining) {
                    paths[pathKey] = tile;
                    newPathsAdded += 1;
                    // delete all paths that used the worse tile
                    Object.keys(paths).forEach((key) => {
                        const path = paths[key];
                        if (key !== pathKey && path.length > existingPath.length && path.path.includes(existingPath.path)) {
                            // 0:0(3)|1:0(3)|2:0(2)|2:1(3)|3:1(3)|4:1(2)|4:2(3)|5:2(3)|6:2(2)|6:3(3)|7:3(3)|8:3(2)|8:4(3)
                            // 0:0(3)|1:0(3)|2:0(2)|2:1(3)|3:1(3)|4:1(2)|4:2(3)|5:2(3)|6:2(2)|6:3(3)|7:3(3)|8:3(2)
                            // 0:0(3)|1:0(3)|2:0(2)|2:1(3)|3:1(3)|4:1(2)|4:2(3)|5:2(3)|6:2(2)|6:3(3)|7:3(3)|8:3(2)|8:4(3)
                            // 0:0(3)|0:1(3)|1:1(3)|2:1(2)|2:0(3)|3:0(3)|4:0(2)|5:0(1)|5:1(3)|6:1(3)|7:1(2)|8:1(1)|8:2(3)|8:3(2)|8:4(3)
                            // 0:0(3)|0:1(3)|1:1(3)|2:1(2)|2:0(3)|3:0(3)|4:0(2)|5:0(1)|5:1(3)|6:1(3)|7:1(2)|8:1(1)|8:2(3)|8:3(2)

                            path.path = path.path.replace(existingPath.path, tile.path);
                            const costDiff = tile.cost - existingPath.cost;
                            if (!path.costCorrections) {
                                path.costCorrections = [];
                            }
                            if (path.finished) {
                                path.costCorrections.push(costDiff);
                            }

                            path.cost += costDiff;
                            if (!path.finished) {
                                // re
                                //path.evaluated = false;
                            }
                        }
                    })
                    //improveExistingPath(existingPath, tile, pathKey);
                }
            }
        });
        return newPathsAdded;
    }
    const advancePaths = (path) => {
        let nrNewPaths = 0;
        Object.keys(paths).forEach((key) => {
            const path = paths[key];
            let res = advancePath(path);
            if (res) {
                nrNewPaths += res;
            }
        });
        return nrNewPaths;
    }
    const reEvalPaths = (path) => {
        Object.values(paths).forEach((p) => {p.evaluated = false;})
    }
    paths['0:0(3)'] = {path: '0:0(3)', length: 0, cost: 0, colNr: 0, rowNr: 0, stepsRemaining: 4, prevColNr: 0, prevRowNr: 0};
    let i;
    for (i = 0;i < 3000; i++) {
        const newPathsCreated = advancePaths();
        if (!newPathsCreated) {
            //console.log('Done: no new paths created');
            //break;
        }
        if (i % 100 === 0) {
            //console.log('Processing paths:', i, 'newPathsCreated', newPathsCreated);
        }
    }
    reEvalPaths();
    const newPathsCreated = advancePaths();
    if (newPathsCreated) {
        //throw new Error('newPathsCreated', newPathsCreated)
    }
    const bestPaths = Object.values(paths).sort((p1, p2) => {
        const dist1ToFinish = (lastTileColNr - p1.colNr) + (lastTileRowNr - p1.rowNr);
        const dist2ToFinish = (lastTileColNr - p2.colNr) + (lastTileRowNr - p2.rowNr);
        if (dist1ToFinish < dist2ToFinish) {
            return -1;
        } else if (dist1ToFinish > dist2ToFinish) {
            return 1;
        }
        if (p1.cost > p2.cost) {
            return 1;
        } else if (p1.cost < p2.cost) {
            return -1;
        }
        return 0;//0:0(3)|1:0(2)|2:0(1)|2:1(3)|3:1(3)|4:1(2)|5:1(1)  p.path.match(/5:1\([0-9]+\)/gi)
    });
    Object.keys(paths).forEach((pathKey) => {
        const path = paths[pathKey];
        path.values = path.path.split('|').map((key) => {
            const parts = key.replace(/\(.*/gi, '')
                .split(':')
                .map(v => +v);
            return rows[parts[1]][parts[0]];
        });

    });//.filter(p => p.path.includes('5:1(1)'));
    const lastTile = paths[lastTileColNr + ':' + lastTileRowNr];
    const nrPaths = Object.keys(paths).length;
    const pathStrings = Object.values(paths).map(p => p.path);
    const pathValues = Object.values(paths).map(p => {
        return {values: p.values.join(','), path: p}
    }).filter(({values, path}) => {
        return values.match(/^2[1,]+$/gi);
    });
    rows.forEach((row) => {
        let i;
        for (i = 0; i < row.length; i++) {
            row[i] = ' ' + row[i] + ' ';
        }
    })
    const highlightPath = (path) => {
        const steps = path.path.split('|');
        steps.forEach((key) => {
            const parts = key.split(':');
            const x = +parts[0];
            const y = +(parts[1].replace(/\(.+/gi, ''));
            const value = rows[y][x];
            rows[y][x] = '[' + value.replaceAll(' ', '') + ']';
        })
    }
    highlightPath(bestPaths[0]);
    console.log(rows, nrPaths, lastTile, finishedPaths, bestPaths, bestPaths[0].cost);
}
getAnswer()
// 865 too high
//part 1 answer: 847
//part 2 answer: 997
