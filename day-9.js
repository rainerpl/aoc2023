const getAnswer = async () => {
    const res = await fetch('https://adventofcode.com/2023/day/9/input');
    let input = await res.text();
    const inputRows = input.replaceAll(/ +/gi, ' ').split(/\n/gi).filter(v => v);
    /*
    input = `1 3 6 10 15 21`;
    input = `10  13  16  21  30  45`;
    input = `26 35 42 63 136 327 729 1457 2648 4480 7229 11394 17952 28881 48234 84291 153739 289701 557511 1087187 2143197`;*/
    const processRow = (row) => {
        row = row.replaceAll(/ +/gi, ' ').split(' ').filter(v => v).map(v => +v);
        const calcNextRow = (row) => {
            let nextRow = [];
            let i;
            for (i = 1; i < row.length; i++) {
                nextRow.push(row[i] - row[i - 1]);
            }
            return nextRow;
        }
        //const rows = [row]; // Part 1 direction
        const rows = [row.reverse()];// Part 2 direction
        let currentRow = rows[0];
        let i;
        for (i = 0; i < 100; i++) {
            const nextRow = calcNextRow(currentRow);
            const nrNonZeros = nextRow.filter(v => v !== 0).length;
            rows.push(nextRow);
            currentRow = nextRow;
            if (!nrNonZeros) {
                console.log('done');
                break;
            }
        }
        // add zer0
        rows[rows.length - 1].push(0);
        for (i = rows.length - 1; i > 0; i--) {
            const bottomRow = rows[i];
            const topRow = rows[i - 1];
            if (!topRow) {
                break;
            }
            topRow.push(bottomRow[bottomRow.length - 1] + topRow[bottomRow.length - 1]);

        }
        return rows[0];
    }
    const answerRows = inputRows.map(processRow);
    console.log(answerRows.reduce((total, rows) => {
        return total + rows[rows.length - 1];
    }, 0));
}
getAnswer();
// Part 1 answer 1921197370, part 2 answer is 1124
