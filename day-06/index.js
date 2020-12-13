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

function partTwo() {
    let sumOfCounts = 0;
    groups.forEach(group => {
        const reference = group.personInputs[0];

        // TODO find a better name for this variable :)
        let countOfQuestionsThatEveryoneAnsweredYesTo = 0;

        for (let i = 0; i < reference.length; i++) {
            const currentQuestion = reference[i];
            if (group.personInputs.every(personInput => personInput.includes(currentQuestion))) {
                countOfQuestionsThatEveryoneAnsweredYesTo++;
            }
        }

        sumOfCounts += countOfQuestionsThatEveryoneAnsweredYesTo;
    });
    return sumOfCounts;
}

console.log(`Part one: The sum of counts is ${partOne()}`);
console.log(`Part two: The sum of counts is ${partTwo()}`);
