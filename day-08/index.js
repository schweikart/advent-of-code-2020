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

/**
 * Parses an instruction.
 * @param {string} instructionString the instruction at that index.
 * @param {number} index the zero-based index of the instruction in the program.
 */
function parseInstruction(instructionString, index) {
    const match = instructionString.match(/^(acc|jmp|nop) ([\+\-][0-9]+)$/);
    if (!match) {
        throw new Error(`Instruction '${instructionString}' (index ${index}) does not match expected format!`);
    }

    const opCode = match[1];
    const argument = parseInt(match[2]);

    return {
        index,
        opCode,
        argument,
        executionCount: 0,
    };
}

const instructionStrings = input.split(/\r?\n/);

// remove empty line at the end
if (instructionStrings[instructionStrings.length - 1] === '') {
    instructionStrings.pop();
}

const program = instructionStrings.map(parseInstruction);

/**
 * Executes an instruction in a process. This includes determining the next
 * instruction index and incrementing the execution count.
 * @param {*} process the process to execute the instruction in.
 * @param {*} instruction the instruction to execute.
 */
function executeInstruction(process, instruction) {
    switch (instruction.opCode) {
        case 'acc':
            process.accumulator += instruction.argument;
            process.nextInstructionIndex++;
            break;
        case 'jmp':
            process.nextInstructionIndex += instruction.argument;
            break;
        case 'nop':
            process.nextInstructionIndex++;
            break;
        default:
            throw new Error(`Instruction '${instruction}' has an invalid opCode!`)
    }
    instruction.executionCount++;
}

/**
 * Runs the program until before any instruction is invoked a second time.
 */
function runProgramUntilLoop() {
    const process = {
        accumulator: 0,
        nextInstructionIndex: 0,
        program,
    };

    const next = () => process.program[process.nextInstructionIndex];

    for (let instruction = next(); instruction.executionCount === 0; instruction = next()) {
        executeInstruction(process, instruction);
    }
    
    return process;
}

function partOne() {
    return runProgramUntilLoop().accumulator;
}

console.log(`Part one: ${partOne()} is the value in the accumulator before the program looped.`)
