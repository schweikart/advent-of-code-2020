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
const ruleStrings = input.split(/\r?\n/);

// remove empty rule in last line
if (ruleStrings[ruleStrings.length - 1] === '') {
    ruleStrings.pop();
}

/**
 * Parses a bag amount string into an object with a 'color' and an 'amount'
 * property.
 * @param {string} bagAmountString the bag amount string to parse.
 */
function parseBagAmount(bagAmountString) {
    const match = bagAmountString.match(/^(\d) ([a-z]+ [a-z]+) bags?$/);
    if (!match) {
        throw new Error(`Bag amount string '${bagAmountString}' does not match expected format!`);
    }

    return {
        color: match[2],
        amount: parseInt(match[1]),
    }
}

const rules = ruleStrings.map(string => {
    const match = string.match(/^([a-z]+ [a-z]+) bags contain ([a-z0-9 ,]+).$/);
    if (!match) {
        throw new Error(`Rule '${string}' does not match expected format!`);
    }

    const color = match[1];
    let contents = [];

    if (match[2] !== 'no other bags') {
        const contentStrings = match[2].split(', ');
        contents = contentStrings.map(parseBagAmount);
    }

    return {
        color,
        contents
    }
});

function getRuleByColor(color) {
    return rules.find(rule => rule.color === color);
}

function containsBagOfColorIndirectly(rule, color) {
    for (let i = 0; i < rule.contents.length; i++) {
        if (rule.contents[i].color === color) {
            return true;
        } else if (containsBagOfColorIndirectly(getRuleByColor(rule.contents[i].color), color)) {
            return true;
        }
    }
    return false;
}

/**
 * Counts how many bags are inside a given bag.
 * @param {string} color the color of the bag to count contained bags of.
 */
function countBagsWithin(color) {
    let count = 0;
    getRuleByColor(color).contents.forEach(content => {
        count += content.amount;
        count += content.amount * countBagsWithin(content.color);
    });
    return count;
}

function partOne() {
    let count = 0;
    rules.forEach(rule => {
        if (containsBagOfColorIndirectly(rule, 'shiny gold')) {
            count++;
        }
    });
    return count;
}

function partTwo() {
    return countBagsWithin('shiny gold');
}

console.log(`Part one: ${partOne()} bag colors may contain the 'shiny gold' colored bag indirectly.`);
console.log(`Part two: ${partTwo()} bags are contained withing a 'shiny gold' bag.`);
