// parse input

const { existsSync, readFileSync } = require('fs');
const { exit } = require('process');

const INPUT_FILE = 'input.txt';

if (!existsSync(INPUT_FILE)) {
    console.error('Missing input file!');
    exit(1);
}
const input = readFileSync(INPUT_FILE).toString();

const numbers = input.split('\n').map(string => parseInt(string));

console.log(`Processing ${numbers.length} numbers.`);

// process input

/**
 * Finds two numbers that add up to 2020 and returns their product.
 * @param {Array<number>} numbers the numbers to process.
 * @returns the product of the two numbers that add up to 2020 or -1 if no
 * matching combination could be found.
 */
function partOne(numbers) {
    let theI = -1;
    let theJ = -1;

    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            if ((numbers[i] + numbers[j]) === 2020) {
                theI = i;
                theJ = j;
            }
        }
    }

    if (theI === -1) {
        return -1;
    } else {
        return numbers[theI] * numbers[theJ];
    }
}

/**
 * Finds three numbers that add up to 2020 and returns their product.
 * @param {Array<number>} numbers the numbers to process.
 * @returns the product of the three numbers that add up to 2020 or -1 if no
 * matching combination could be found.
 */
function partTwo(numbers) {
    let theI = -1;
    let theJ = -1;
    let theK = -1;

    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            for (let k = 0; k < numbers.length; k++) {
                if ((numbers[i] + numbers[j] + numbers[k]) === 2020) {
                    theI = i;
                    theJ = j;
                    theK = k;
                }
            }
        }
    }

    if (theI === -1) {
        return -1;
    } else {
        return numbers[theI] * numbers[theJ] * numbers[theK];
    }
}

const solutionOne = partOne(numbers);
if (solutionOne === -1) {
    console.error('Could not find a solution to part one!');
} else {
    console.log(`Solution to part one: ${solutionOne}`);
}

const solutionTwo = partTwo(numbers);
if (solutionTwo === -1) {
    console.error('Could not find a solution to part two!');
} else {
    console.log(`Solution to part two: ${solutionTwo}`);
}
