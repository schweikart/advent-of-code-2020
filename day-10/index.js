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

const outputJoltages = lines.map(line => parseInt(line, 10));

function partOne() {
    const joltageSteps = outputJoltages.sort((a, b) => a - b);

    // insert basis joltage amount
    joltageSteps.unshift(0);

    // append built-in joltage adapter
    joltageSteps.push(joltageSteps[joltageSteps.length - 1] + 3);

    // count joltage differences
    let diffOneCount = 0;
    let diffTwoCount = 0;
    let diffThreeCount = 0;

    for (let i = 1; i < joltageSteps.length; i++) {
        const diff = joltageSteps[i] - joltageSteps[i - 1];
        if (diff === 1) {
            diffOneCount++;
        } else if (diff === 2) {
            diffTwoCount++;
        } else if (diff === 3) {
            diffThreeCount++;
        } else {
            throw new Error(`Illegal joltage difference: ${joltageSteps[i - 1]}, ${joltageSteps[i]}`);
        }
    }

    return diffOneCount * diffThreeCount;
}

console.log(`Part one: ${partOne()}`)