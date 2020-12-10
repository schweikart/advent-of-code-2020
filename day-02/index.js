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
        position1: parseInt(match[1]),
        position2: parseInt(match[2]),
        password: match[4]
    }
});

// validate passwords and count them
function partOne() {
    let validPasswords = 0;
    validations.forEach(element => {
        let thatCharacterCount = 0;
        for (let i = 0; i < element.password.length; i++) {
            if (element.password.charAt(i) == element.character) {
                thatCharacterCount++;
            }
        }
    
        if (thatCharacterCount >= element.position1 && thatCharacterCount <= element.position2) {
            validPasswords++;
        }
    });
    return validPasswords;
}

function partTwo() {
    let validPasswords = 0;
    validations.forEach(element => {
        let isCharAtPos1 = element.password.charAt(element.position1 - 1) === element.character;
        let isCharAtPos2 = element.password.charAt(element.position2 - 1) === element.character;

        if (isCharAtPos1 != isCharAtPos2) { // != for booleans is XOR
            validPasswords++;
        }
    });
    return validPasswords;
}

console.log(`${partOne()} out of ${validations.length} passwords are valid with the sled rental place policy.`);
console.log(`${partTwo()} out of ${validations.length} passwords are valid with the Official Toboggan Corporate policy.`);