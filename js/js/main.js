'use strict'
const defaultText = 'Text Here';
const defaultSize = 30;

var gCtx;
var gLines;
var gSelectedLine;
function init() {
    // initService();
    initGallery();
}


//EDITOR
function initEditor(){
    document.querySelector('.gallery').classList.add('hidden');
    document.querySelector('.editor').classList.remove('hidden')
    gLines = getLines();
    gSelectedLine = gLines[0];
    var elCanvas = document.querySelector('canvas');
    gCtx = elCanvas.getContext('2d');
    drawAll();
}
function drawAll() {
    drawImg(getMemeImgUrl());
    function drawImg(path) {
        var elImg = new Image();
        elImg.src = path;
        elImg.onload = () => {
            gCtx.drawImage(elImg, 0, 0, 500, 500);
            drawAllText();
            drawSelectedRect();
        }
    }
    function drawAllText() {
        gLines.forEach(line => drawText(line));
        function drawText(line) {
            gCtx.lineWidth = '2';
            gCtx.strokeStyle = 'white';
            gCtx.fillStyle = line.color;
            gCtx.font = line.size + 'px impact';
            gCtx.textAlign = 'left';
            gCtx.fillText(line.text, line.x, line.y);
            gCtx.strokeText(line.text, line.x, line.y);
        }
    }
    function drawSelectedRect() {
        if (!gSelectedLine) return;
        const textWidth = gCtx.measureText(gSelectedLine.text).width;
        gCtx.beginPath();
        gCtx.rect(gSelectedLine.x, gSelectedLine.y - gSelectedLine.size + 5, textWidth, gSelectedLine.size - 5);
        gCtx.strokeStyle = 'black';
        gCtx.stroke();
    }
}
function clearCanvas() {
    gCtx.clearRect(0, 0, 500, 500);
}
function onCanvasClick(ev) {
    const { offsetX, offsetY } = ev;
    gSelectedLine = gLines.find(line => {
        var textWidth = gCtx.measureText(line.text).width;
        return line.x + textWidth >= offsetX &&
            line.x <= offsetX &&
            line.y - line.size <= offsetY &&
            line.y >= offsetY
    });
    if (!gSelectedLine) {
        gSelectedLine = {
            text: defaultText,
            size: defaultSize,
            color: 'red',
            x: offsetX,
            y: offsetY
        };
        gLines.push(gSelectedLine);
    }
    var lineText = document.querySelector('.lineText')
    lineText.value = gSelectedLine.text;
    lineText.focus();
    clearCanvas();
    drawAll();
}
function onInput(ev) {
    gSelectedLine.text = ev.target.value;
    clearCanvas();
    drawAll();
}
// function onSave() {
//     saveMemes();
// }
function onRemoveLine() {
    if (!gSelectedLine) return;
    removeLine(gSelectedLine);
    gLines = getLines();
    gSelectedLine = gLines[0];
    clearCanvas();
    drawAll();
}
function onDownload() {
    var tempSelectedLine = gSelectedLine;
    gSelectedLine = null;
    clearCanvas();
    drawAll();
    setTimeout(() => {
        var link = document.createElement('a');
        link.download = 'meme.jpg';
        link.href = document.querySelector('canvas').toDataURL();
        link.click();
        gSelectedLine = tempSelectedLine;
    }, 50);

}