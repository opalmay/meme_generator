'use strict'

var gKeywords = [
    { id: 1, keywords: ['Trump', 'Funny Face', 'Older Guy'] },
    { id: 2, keywords: ['Nature'] },
    { id: 3, keywords: ['Animals', 'Dogs'] },
    { id: 4, keywords: ['Animals', 'Dogs', 'Small Human'] },
    { id: 5, keywords: ['Baby', 'Funny Face'] },
    { id: 6, keywords: ['Animals', 'Cats'] },
    { id: 7, keywords: ['Funny Face', 'Smile'] },
    { id: 8, keywords: ['Crazy Guy', 'Smile'] },
    { id: 9, keywords: ['Small Human', 'Funny Face', 'Smile'] },
    { id: 10, keywords: ['Funny Face', 'Older Guy'] },
    { id: 11, keywords: ['Small Human', 'Smile'] },
    { id: 12, keywords: ['Funny Face', 'Older Guy'] },
    { id: 13, keywords: ['Trump', 'Funny Face', 'Older Guy'] },
    { id: 14, keywords: ['Small Human', 'Funny Face'] },
    { id: 15, keywords: ['Animals', 'Dogs'] },
    { id: 16, keywords: ['Funny Face', 'Smile'] },
    { id: 17, keywords: ['Funny Face'] },
    { id: 18, keywords: ['Smile', 'Older Guy'] },
    { id: 19, keywords: ['Funny Face'] },
    { id: 20, keywords: ['Funny Face', 'Older Guy'] },
    { id: 21, keywords: ['Older Guy'] },
    { id: 22, keywords: ['Funny Face'] },
    { id: 23, keywords: ['Funny Face', 'Older Guy', 'Smile'] },
    { id: 24, keywords: ['Older Guy'] },
    { id: 25, keywords: ['Funny Face'] }
];
var gKeywordsMap;

var gMeme;

// var gFilteredImgs;
function initService(selectedImgId = 0) {
    gMeme = {
        selectedImgId,
        selectedLineId: 0,
        lines: [
            {
                text: 'I never eat Falafel',
                size: 40,
                font: 'Impact',
                textColor: 'white',
                strokeColor: 'black',
                x: 100,
                y: 50
            }
        ]
    };
    loadKeywords();
}
function getMemeImgUrl(imgId = gMeme.selectedImgId) {
    return `img/${imgId}.jpg`;
}

function loadKeywords() {
    gKeywordsMap = loadFromStorage('keywords');
    if (!gKeywordsMap) gKeywordsMap = {};
    gKeywords.forEach(keywords => {
        keywords.keywords.forEach(keyword => {
            if (!gKeywordsMap[keyword]) {
                gKeywordsMap[keyword] = 1;
            }
        })
    })
    saveKeywords();
}
function saveKeywords() {
    saveToStorage('keywords', gKeywordsMap);
}
function getKeywords() {
    return gKeywordsMap;
}
function keywordClicked(keyword) {
    console.log('keyowrd: ', keyword);
    gKeywordsMap[keyword]++;
    saveKeywords();
}
function getFilteredImages(keyword) {
    if (keyword === '') return gKeywords;
    return gKeywords.filter(img => img.keywords.includes(keyword));
}


// EDITOR
function removeLine(lineToRemove) {
    gMeme.lines = getLines().filter(line => line !== lineToRemove);
}
function getLines() {//?
    return gMeme.lines;
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineId];
}
function addLine(line) {
    gMeme.lines.push(line);
}
function moveSelectedLine(x, y) {
    getSelectedLine().x = x;
    getSelectedLine().y = y;
}
function changeSelectedLineTextColor(color) {
    getSelectedLine().textColor = color;
}
function changeSelectedLineStrokeColor(color) {
    getSelectedLine().strokeColor = color;
}
function changeSelectedLineSize(size) {
    getSelectedLine().size = size;
}