
const res = await fetch('https://adventofcode.com/2023/day/11/input');
const input = await res.text();
let grid = {};
const colsWithHashes = {}
const colsWithoutHashes = [];
const rowsWithoutHashes = [];
let rows = input.split(/\n/gi).filter(v => v);
rows = rows.map((row, rowIndex) => {
    return row.split('').map((char, colIndex) => {
        grid[colIndex + ':' + rowIndex] = char;
        if (char === '#') {
            colsWithHashes[colIndex] = colIndex;
        }
        return char;
    });
})
const expand = () => {
    const expandedRows = [];
    let i;
    const initialLength = rows[0].length;
    for (i = 0; i < initialLength; i++) {
        if (colsWithHashes[i] === undefined) {
            colsWithoutHashes.push(i);
        }
    }
    rows.forEach((row, index) => {
        expandedRows.push(row);
        if (!row.includes('#')) {
            rowsWithoutHashes.push(index);
        }
    });
    grid = {};
    let nr = 0;
    expandedRows.forEach((row, rowIndex) => {
        row.forEach((char, colIndex) => {
            if (char === '#') {
                nr += 1;// just for visual help
                grid[colIndex + ':' + rowIndex] = {rowIndex, colIndex, nr};
            }
        });
    });
    return expandedRows;
}
rows = expand();
const getDistances = () => {
    const galaxies = Object.values(grid);
    const paths = {};
    const expansionMultiplierPart1 = 2;
    const expansionMultiplierPart2 = 1000000;
    galaxies.forEach((g1) => {
        if (!g1.paths) { g1.paths = {}}
        galaxies.forEach((g2) => {
            if (g1 === g2) { return ;}
            if (!g2.paths) { g2.paths = {}}
            const pathKey = g1.nr < g2.nr ? g1.nr + ':' + g2.nr : g2.nr + ':' + g1.nr;
            if (g1.paths[pathKey]) {
                return ;
            }
            const topRowIndex = g1.rowIndex < g2.rowIndex ? g1.rowIndex : g2.rowIndex;
            const bottomRowIndex = g1.rowIndex > g2.rowIndex ? g1.rowIndex : g2.rowIndex;
            const leftColIndex = g1.colIndex < g2.colIndex ? g1.colIndex : g2.colIndex;
            const rightRowIndex = g1.colIndex > g2.colIndex ? g1.colIndex : g2.colIndex;
            const colExpansion = colsWithoutHashes.filter(colIndex => colIndex > leftColIndex && colIndex < rightRowIndex).length * (expansionMultiplierPart2 - 1 );
            const rowExpansion = rowsWithoutHashes.filter(rowIndex => rowIndex > topRowIndex && rowIndex < bottomRowIndex).length * (expansionMultiplierPart2 - 1 );
            const newPath = {
                g1,
                g2,
                dist: Math.abs(g2.rowIndex - g1.rowIndex) + Math.abs(g2.colIndex - g1.colIndex) + colExpansion + rowExpansion,
            }
            g1.paths[pathKey] = g2.paths[pathKey] = newPath;
            paths[pathKey] = newPath;
        });
    });
    let totalPathSum = 0;
    Object.values(paths).forEach((p) => {
        totalPathSum += p.dist
    });
    console.log(paths, 'Answer to part one is ', totalPathSum);
}
getDistances();
