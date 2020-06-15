'use strict'
const defaultText = 'Text Here';
const defaultSize = 40;
const defaultFont = 'Impact';

var gMeme;

// EDITOR

function initEditorService(selectedImgId) {
    gMeme = {
        selectedImgId,
        lines: [
            {
                text: 'I never eat Falafel',
                size: defaultSize,
                font: defaultFont,
                textColor: 'white',
                strokeColor: 'black',
                x: 100,
                y: 50
            }
        ]
    };
    gMeme.selectedLine = gMeme.lines[0]; 
}

function removeSelectedLine() {
    gMeme.lines = gMeme.lines.filter(line => line !== gMeme.selectedLine);
    if (gMeme.lines.length !== 0) gMeme.selectedLine = gMeme.lines[0];
    else gMeme.selectedLine = null;
}

function getLines() {
    return gMeme.lines;
}

function getSelectedLine() {
    return gMeme.selectedLine;
}

function addLine(line) {
    gMeme.lines.push(line);
}

function moveSelectedLine(x, y) {
    if (!gMeme.selectedLine) return;
    gMeme.selectedLine.x = x;
    gMeme.selectedLine.y = y;
}

function changeSelectedLineText(text) {
    if (!gMeme.selectedLine) return;
    gMeme.selectedLine.text = text;
}
function changeSelectedLineTextColor(color) {
    if (!gMeme.selectedLine) return;
    gMeme.selectedLine.textColor = color;
}
function changeSelectedLineStrokeColor(color) {
    if (!gMeme.selectedLine) return;
    gMeme.selectedLine.strokeColor = color;
}
function changeSelectedLineSize(size) {
    if (!gMeme.selectedLine) return;
    gMeme.selectedLine.size = size;
}
function changeSelectedLineFont(font) {
    if (!gMeme.selectedLine) return;
    gMeme.selectedLine.font = font;
}
function addLine(line) {
    gMeme.lines.push(line);
}
function addLineWithDefaults(x, y) {
    let newLine = {
        text: defaultText,
        font: defaultFont,
        size: defaultSize,
        textColor: 'white',
        strokeColor: 'black',
        y: y + (defaultSize / 2)
    };
    newLine.x = x - (measureLine(newLine) / 2);
    addLine(newLine);
    return newLine;
}
function setSelectedLine(line) {
    gMeme.selectedLine = line;
}
function getLineByIndexes(x, y) {
    return gMeme.lines.find(line => {
        let textWidth = measureLine(line);
        return line.x + textWidth >= x &&
            line.x <= x &&
            line.y - line.size <= y &&
            line.y >= y
    });
}
function measureLine(line) {
    let elCanvas = document.createElement('canvas');
    let gCtx = elCanvas.getContext('2d');
    gCtx.font = line.size + 'px ' + line.font;
    return gCtx.measureText(line.text).width;
}