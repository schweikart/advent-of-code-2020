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
const validations = input.split('\n').map(line => {
    const match = line.match(/(\d+)-(\d+) ([a-z]): ([a-z]+)/);
    return {
        character: match[3],
        minimum: parseInt(match[1]),
        maximum: parseInt(match[2]),
        password: match[4]
    }
});

// validate passwords and count them
let validPasswords = 0;
validations.forEach(element => {
    let thatCharacterCount = 0;
    for (let i = 0; i < element.password.length; i++) {
        if (element.password.charAt(i) == element.character) {
            thatCharacterCount++;
        }
    }

    if (thatCharacterCount >= element.minimum && thatCharacterCount <= element.maximum) {
        validPasswords++;
    }
});

console.log(`Found ${validPasswords} out of ${validations.length} valid passwords.`);