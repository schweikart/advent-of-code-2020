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
const groupInputs = input.split(/\r?\n\r?\n/);

const groups = groupInputs.map(groupInput => {
    const personInputs = groupInput.split(/\r?\n/);

    const questionsWithAnyYes = new Set();

    personInputs.forEach(personInput => {
        for (let i = 0; i < personInput.length; i++) {
            questionsWithAnyYes.add(personInput.charAt(i));
        }
    });

    return {
        personInputs,
        questionsWithAnyYes,
    }
});

function partOne() {
    let countOfSums = 0;
    groups.forEach(group => {
        countOfSums += group.questionsWithAnyYes.size;
    });
    return countOfSums;
}

console.log(`Part one: The sum of counts is ${partOne()}`);
