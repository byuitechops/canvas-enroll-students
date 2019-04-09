const main = require('./main.js');
const d3 = require('d3-dsv'),
    fs = require('fs'),
    path = require('path');

async function getInput() {
    var csvData = d3.csvParse(fs.readFileSync(path.resolve('./csv/test.csv')));
    return csvData;
}

async function getOutput(output) {
    // How to output data, eg. to csv, to json, to console, etc.
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