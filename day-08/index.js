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
 * Runs the program until before any instruction is invoked a second time or
 * until it reaches the end.
 */
function runProgramUntilLoop() {
    const process = {
        accumulator: 0,
        nextInstructionIndex: 0,
        program,
    };

    const next = () => {
        if (process.nextInstructionIndex >= process.program.length) {
            return undefined;
        } else {
            return process.program[process.nextInstructionIndex];
        }
    }

    for (let instruction = next(); instruction !== undefined && instruction.executionCount === 0; instruction = next()) {
        executeInstruction(process, instruction);
    }
    
    return process;
}

function switchAndRun(switchIndex) {
    const oldOpCode = program[switchIndex].opCode;

    // switch op code
    program[switchIndex].opCode = oldOpCode === 'nop' ? 'jmp' : 'nop';

    const process = runProgramUntilLoop();

    // switch back op code
    program[switchIndex].opCode = oldOpCode;

    return {
        aborted: process.nextInstructionIndex < process.program.length,
        accumulator: process.accumulator,
    }
}

function resetExecutionCounters() {
    program.forEach(instruction => {
        instruction.executionCount = 0;
    });
}

function partOne() {
    return runProgramUntilLoop(program).accumulator;
}

function partTwo() {
    // experimentally switch individual 'nop' and 'jmp' instructions
    for (let currentSwitchIndex = 0; currentSwitchIndex < program.length; currentSwitchIndex++) {
        const curr = program[currentSwitchIndex];

        if ((curr.opCode === 'nop' && curr.argument !== 0 && curr.argument !== 1) || // nop +0 -> jmp +0 (would create infinite loop), nop +1 -> jmp +1 (would not change execution flow)
                (curr.opCode === 'jmp' && curr.argument !== 1)) { // jmp +1 -> nop +1 (would not change execution flow)
            resetExecutionCounters();
            const result = switchAndRun(currentSwitchIndex);
            if (!result.aborted) {
                return result.accumulator;
            }
        }
    }
}

console.log(`Part one: ${partOne()} is the value in the accumulator before the program looped.`)
console.log(`Part two: ${partTwo()} is the value in the accumulator after the program terminated.`);
