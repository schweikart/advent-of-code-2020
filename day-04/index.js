// read input

const { existsSync, readFileSync } = require('fs');
const { exit } = require('process');

const INPUT_FILE = 'input.txt';

if (!existsSync(INPUT_FILE)) {
    console.error('Missing input file!');
    exit(1);
}

const input = readFileSync(INPUT_FILE).toString();

const passportStrings = input.split(/\r?\n\r?\n/);

const passports = passportStrings.map(string => {
    const props = string.split(/\s+/);

    const passport = {};
    for (let i = 0; i < props.length; i++) {
        const match = props[i].match(/^(byr|iyr|eyr|hgt|hcl|ecl|pid|cid):(.*)$/);
        passport[match[1]] = match[2];
    }
    return passport;
});

function isPassportValid(passport) {
    return 'byr' in passport &&
        'iyr' in passport &&
        'eyr' in passport &&
        'hgt' in passport &&
        'hcl' in passport &&
        'ecl' in passport &&
        'pid' in passport 
}

function partOne() {
    let validCount = 0;
    passports.forEach(passport => {
        if (isPassportValid(passport)) {
            validCount++;
        }
    });
    return validCount;
}

console.log(partOne())