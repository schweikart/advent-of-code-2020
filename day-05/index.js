// read input

const { existsSync, readFileSync } = require('fs');
const { exit } = require('process');

const INPUT_FILE = 'input.txt';

if (!existsSync(INPUT_FILE)) {
    console.error('Missing input file!');
    exit(1);
}

const input = readFileSync(INPUT_FILE).toString();

// evaluate seat locations
const seatStrings = input.split(/\r?\n/);

/**
 * Converts a row code into a row.
 * @param {string} rowCode the row code to evaluate.
 */
function getRow(rowCode) {
    const binaryCol = rowCode.replace(/F/g, '0').replace(/B/g, '1');
    return parseInt(binaryCol, 2);
}

/**
 * Converts a column code into a column.
 * @param {string} colCode the column code to evaluate.
 */
function getColumn(colCode) {
    const binaryCol = colCode.replace(/L/g, '0').replace(/R/g, '1');
    return parseInt(binaryCol, 2);
}

const seats = seatStrings.map(string => {
    const match = string.match(/([FB]{7})([LR]{3})/);

    const row = getRow(match[1]);
    const col = getColumn(match[2]);

    return {
        row,
        col,
        id: row * 8 + col,
    }
});

function partOne() {
    let highestId = -1;

    seats.forEach(seat => {
        highestId = Math.max(highestId, seat.id);
    });

    return highestId;
}

console.log(`Part one: Highest seat ID: ${partOne()}`);