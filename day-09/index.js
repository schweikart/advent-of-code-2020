// read input

const { existsSync, readFileSync } = require('fs');
const { exit } = require('process');

const INPUT_FILE = 'input.txt';

if (!existsSync(INPUT_FILE)) {
    console.error('Missing input file!');
    exit(1);
}

const input = readFileSync(INPUT_FILE).toString();

// parse data

const lines = input.split(/\r?\n/);
if (lines[lines.length - 1] === '') {
    lines.pop();
}

const numbers = lines.map(line => {
    if (!/^\d+$/.test(line)) {
        throw new Error(`Could not parse number ${line}!`);
    } else {
        return parseInt(line, 10);
    }
});

function validate(index) {
    if (index < 25) {
        return true;
    } else {
        const previous25 = numbers.slice(index - 25, index);
        const next = numbers[index];

        for (let i = 0; i < previous25.length; i++) {
            for (let j = 0; j < previous25.length; j++) {
                const numA = previous25[i];
                const numB = previous25[j];

                if (numA !== numB && ((numA + numB) === next)) {
                    return true;
                }
            }
        }
        return false;
    }
}

function partOne() {
    for (let i = 25; i < numbers.length; i++) {
        if (!validate(i)) {
            console.log(i);
            console.log(numbers.slice(i - 25, i));
            return numbers[i];
        }
    }
    throw new Error('Could not find any number that is not the sum of the previous 25!');
}

console.log(`Part one: ${partOne()} is the first number that is not the sum of the previous 25 numbers.`);
