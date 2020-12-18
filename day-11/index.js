// read input

const { existsSync, readFileSync } = require('fs');
const { exit } = require('process');
const { isContext } = require('vm');

const INPUT_FILE = 'input.txt';

if (!existsSync(INPUT_FILE)) {
    console.error('Missing input file!');
    exit(1);
}

const input = readFileSync(INPUT_FILE).toString();

// parse data

const grid = input.split(/\r?\n/);
if (grid[grid.length - 1] === '') {
    grid.pop();
}

/**
 * Gets the seat state (., #, L) of a seat spot at a given position, even if the
 * position is not valid.
 * @param {number} x the horizontal position of the seat.
 * @param {number} y the vertical position of the seat.
 */
function getSeatState(grid, x, y) {
    if (y >= 0 && y < grid.length && x >= 0 && x < grid[y].length) {
        return grid[y][x];
    } else {
        return '.';
    }
}

function setSeatState(grid, x, y, state) {
    if (y >= 0 && y < grid.length && x >= 0 && x < grid[y].length) {
        if (state === '#' || state === 'L') {
            grid[y] = grid[y].substr(0, x) + state + grid[y].substr(x + 1);
        } else {
            throw new Error(`'${state}' is not a valid state!`);
        }
    } else {
        throw new Error(`Can not set seat state outside of the grid! (${x}, ${y})`);
    }
}

/**
 * Checks whether there is a seat at a given position (free or occupied).
 * @param {number} x the horizontal coordinate to check for a seat.
 * @param {number} y the vertical coordinate to check for a seat.
 */
function isSeat(grid, x, y) {
    const state = getSeatState(grid, x, y);
    return state === '#' || state === 'L';
}

/**
 * Checks whether there is an occupied seat at a given position.
 * @param {number} x the horizontal coordinate to check for an occupied seat.
 * @param {number} y the vertical coordinate to check for an occupied seat.
 */
function isSeatOccupied(grid, x, y) {
    return getSeatState(grid, x, y) === '#';
}

/**
 * Counts how many adjacent seats to a given seat are occupied.
 * @param {number} x the horizontal position of the seat.
 * @param {number} y the vertical position of the seat.
 */
function countAjacentOccupiedSeats(grid, x, y) {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if ((dx != 0 || dy != 0) && isSeatOccupied(grid, x + dx, y + dy)) {
                count++;
            }
        }
    }
    return count;
}

/**
 * Creates a copy of a given grid and returns it.
 * @param {*} grid the grid to copy.
 */
function copyGrid(grid) {
    return grid.slice();
}

/**
 * Checks whether two grids are equal.
 */
function gridEquals(gridA, gridB) {
    return gridA.length === gridB.length && gridA.every((val, idx) => val === gridB[idx]);
}

/**
 * Runs a simulation step on the given grid and returns the new grid.
 * @param {*} grid the grid to simulate.
 */
function simulateStep(grid) {
    const nextGrid = copyGrid(grid);
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (isSeat(grid, x, y)) {
                const isOccupied = isSeatOccupied(grid, x, y);
                const occupiedAmount = countAjacentOccupiedSeats(grid, x, y);

                if (isOccupied && occupiedAmount >= 4) {
                    setSeatState(nextGrid, x, y, 'L');
                } else if (!isOccupied && occupiedAmount === 0) {
                    setSeatState(nextGrid, x, y, '#');
                }
            }
        }
    }
    return nextGrid;
}

/**
 * Runs simulation steps on a grid until it stabilizes.
 * @param {*} grid the base grid to simulate.
 */
function simulateUntilStable(grid) {
    let nextGrid = grid, currentGrid = [];

    while (!gridEquals(currentGrid, nextGrid)) {
        currentGrid = nextGrid;
        nextGrid = simulateStep(currentGrid);
    }

    return nextGrid;
}

/**
 * Prints a grid to the console.
 * @param {*} grid the grid to print.
 */
function printGrid(grid) {
    console.log(grid.join('\n'));
}

/**
 * Counts how many seats on a given grid are occupied.
 * @param {*} grid the grid to count occupied seats on. 
 */
function countTotalOccupiedSeats(grid) {
    let count = 0;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (isSeatOccupied(grid, x, y)) {
                count++;
            }
        }
    }
    return count;
}

function partOne() {
    return countTotalOccupiedSeats(simulateUntilStable(grid));
}

console.log(`Part one: ${partOne()} seats are occupied once the map is stable.`)