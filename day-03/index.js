// read input

const { existsSync, readFileSync } = require('fs');
const { exit } = require('process');

const INPUT_FILE = 'input.txt';

if (!existsSync(INPUT_FILE)) {
    console.error('Missing input file!');
    exit(1);
}

const input = readFileSync(INPUT_FILE).toString();

// parse input
const map = input.split(/\r?\n/);
const width = map[0].length;

/**
 * Checks whether there is a tree at a given position in the map.
 * @param {number} posX the horizontal distance to the left side.
 * @param {number} posY the vertical distance to the top side.
 */
function isTree(posX, posY) {
    const effectivePosX = posX % width;
    const effectivePosY = posY;

    return map[effectivePosY].charAt(effectivePosX) === '#';
}

/**
 * Counts how many trees you encounter when traversing the map from the
 * top-left corner all the way to the bottom with the given slope.
 * @param {number} slopeX the amount of steps to take to the right in each step.
 * @param {number} slopeY the amount of steps to take to the bottom in each step.
 */
function countTreesOnSlope(slopeX, slopeY) {
    let treeCount = 0;
    for (let posX = 0, posY = 0; posY < map.length; posY += slopeY, posX += slopeX) {
        if (isTree(posX, posY)) {
            treeCount++;
        }
    }
    return treeCount;
}

function partOne() {
    return countTreesOnSlope(3, 1);
}

function partTwo() {
    let product = 1;
    [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]].forEach(slope => {
        product *= countTreesOnSlope(slope[0], slope[1]);
    });
    return product;
}

console.log(`Part one: There are ${partOne()} trees in the way.`);
console.log(`Part two: The product of all of the amounts of encountered trees is ${partTwo()}.`);
