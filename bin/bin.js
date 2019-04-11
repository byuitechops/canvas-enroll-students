const main = require('../main.js');
const d3 = require('d3-dsv'),
    fs = require('fs'),
    path = require('path'),
    { prompt } = require('inquirer');

async function getInput() {
    var csvData = d3.csvParse(fs.readFileSync(path.resolve('./csv/test.csv'), 'utf-8'));
    var sectionId = '38926';

    const questions = [
        {
            type: 'input',
            name: 'sectionId',
            message: 'Target Canvas course section ID number',
            suffix: ':',
            default: '38926',
            validate: input => { return input.match(/(\d{5})/) ? true : false; }
        }, {
            type: 'input',
            name: 'csvPath',
            message: 'Relative path to student CSV list',
            suffix: ':',
            default: './csv/test.csv',
            validate: input => { return fs.existsSync(input) ? true : false; }
        }
    ];

    await prompt(questions).then(answers => {
        csvData = d3.csvParse(fs.readFileSync(path.resolve(answers['csvPath']), 'utf-8'));
        sectionId = answers['sectionId'];
    });
    return {
        students: csvData,
        sectionId: sectionId
    };
}

async function getOutput(output) {
    console.log(output);
    return output;
}

function handleError(error) {
    console.error(error)
    return;
}

async function start(seed) {
    getInput()
        .then(main)
        .then(getOutput)
        .catch(handleError);
}

start()