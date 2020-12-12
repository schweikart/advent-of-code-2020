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

/**
 * Checks whether a passport has all required properties.
 * @param {*} passport the passport to check.
 */
function hasNecessaryAttributes(passport) {
    return 'byr' in passport &&
        'iyr' in passport &&
        'eyr' in passport &&
        'hgt' in passport &&
        'hcl' in passport &&
        'ecl' in passport &&
        'pid' in passport;
}

/**
 * Checks whether a string is a valid year.
 * @param {string} yearString the string to validate.
 */
function isValidYear(yearString) {
    return /^\d{4}$/.test(yearString);
}

/**
 * Checks whether a birth year string is valid.
 * @param {string} birthYearString the birth year string to validate.
 */
function isValidBirthYear(birthYearString) {
    if (!isValidYear(birthYearString)) {
        return false;
    } else {
        const birthYear = parseInt(birthYearString, 10);
        return (birthYear >= 1920) && (birthYear <= 2002);
    }
}

/**
 * Checks whether an issue year string is valid.
 * @param {string} issueYearString the issue year string to validate.
 */
function isValidIssueYear(issueYearString) {
    if (!isValidYear(issueYearString)) {
        return false;
    } else {
        const issueYear = parseInt(issueYearString, 10);
        return (issueYear >= 2010) && (issueYear <= 2020);
    }
}

/**
 * Checks whether an expiration year string is valid.
 * @param {string} expirationYearString the expiration year string to validate.
 */
function isValidExpirationYear(expirationYearString) {
    if (!isValidYear(expirationYearString)) {
        return false;
    } else {
        const expirationYear = parseInt(expirationYearString, 10);
        return (expirationYear >= 2020) && (expirationYear <= 2030);
    }
}

/**
 * Checks whether a height string is valid.
 * @param {string} heightString the height string to validate.
 */
function isValidHeight(heightString) {
    const match = heightString.match(/^(\d+)(cm|in)$/);

    if (!match) {
        return false;
    } else {
        const height = parseInt(match[1]);

        if (match[2] === 'in') {
            // inch
            return height >= 59 && height <= 76;
        } else {
            // cm
            return height >= 150 && height <= 193;
        }
    }
}

/**
 * Checks whether a hair color is valid.
 * @param {string} hairColor the hair color to validate.
 */
function isValidHairColor(hairColor) {
    return hairColor.match(/^#[a-f0-9]{6}$/);
}

/**
 * Checks whether the eye color is valid.
 * @param {string} eyeColor the eye color to validate.
 */
function isValidEyeColor(eyeColor) {
    return /^amb|blu|brn|gry|grn|hzl|oth$/.test(eyeColor);
}

/**
 * Checks whether the passport identifier is valid.
 * @param {string} passportId the passport identifier to validate.
 */
function isValidPassportId(passportId) {
    return /^\d{9}$/.test(passportId);
}

/**
 * Checks whether the attributes of a passport are valid.
 * @param {*} passport the passport to check.
 */
function isValidPassport(passport) {
    return hasNecessaryAttributes(passport) &&
        isValidBirthYear(passport.byr) &&
        isValidIssueYear(passport.iyr) &&
        isValidExpirationYear(passport.eyr) &&
        isValidHeight(passport.hgt) &&
        isValidHairColor(passport.hcl) &&
        isValidEyeColor(passport.ecl) &&
        isValidPassportId(passport.pid);
}

function partOne() {
    let validCount = 0;
    passports.forEach(passport => {
        if (hasNecessaryAttributes(passport)) {
            validCount++;
        }
    });
    return validCount;
}

function partTwo() {
    let validCount = 0;
    passports.forEach(passport => {
        if (isValidPassport(passport)) {
            validCount++;
        }
    });
    return validCount;
}

console.log(`Part one: Number of passports with all required attributes: ${partOne()}`);
console.log(`Part two: Number of valid passports: ${partTwo()}`);