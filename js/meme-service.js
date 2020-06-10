'use strict'

var gKeywords;
var gImgs;
var gMeme;

function initService(selectedImgId) {
    gMeme = {
        selectedImgId: selectedImgId,
        selectedLineIdx: 0,
        lines: [
            {
                text: 'I never eat Falafel',
                size: 30,
                color: 'red',
                x: 100,
                y: 100
            }
        ]
    };
    // loadMemes();
    loadImgs();
    loadKeywords();
}
function getLines() {
    return gMeme.lines;
}
function getMemeImgUrl() {
    return `/img/${gMeme.selectedImgId}.jpg`;
}
function removeLine(lineToRemove) {
    gMeme.lines = getLines().filter(line => line !== lineToRemove);
}
// function getImgById(id) {
//     return gImgs.find(img => img.id === id);
// }

// function loadMemes() {
//     gMemes = loadFromStorage('memes');
//     gMemeInEditor = gMemes[0];
// }
function loadImgs() {
    gImgs = loadFromStorage('imgs');
}
function loadKeywords() {
    gKeywords = loadFromStorage('keywords');
}
// function saveMemes() {
//     gMemes = saveToStorage('memes', gMemes);
// }