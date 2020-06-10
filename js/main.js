'use strict'
const defaultText = 'Text Here';
const defaultSize = 30;

var gCtx;
var gLines;
var gSelectedLine;
var gElImg;
function init() {
    // initService();
    initGallery();
}


//EDITOR
function initEditor() {
    gElImg = new Image();
    gElImg.src = getMemeImgUrl();
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
        gCtx.drawImage(gElImg, 0, 0, 500, 500);
        drawAllText();
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
    drawSelectedRect();
    function drawSelectedRect() {
        if (!gSelectedLine) return;
        gCtx.font = gSelectedLine.size + 'px impact';
        const textWidth = gCtx.measureText(gSelectedLine.text).width;
        gCtx.beginPath();
        gCtx.rect(gSelectedLine.x, gSelectedLine.y - gSelectedLine.size, textWidth, gSelectedLine.size);
        gCtx.strokeStyle = 'black';
        gCtx.stroke();
    }
}
function clearCanvas() {
    gCtx.clearRect(0, 0, 500, 500);
}
function onCanvasClick(ev) {
    const { offsetX, offsetY } = ev;
    gSelectedLine = getLineByIndexes(offsetX, offsetY);
    if (!gSelectedLine) {
        gSelectedLine = {
            text: defaultText,
            size: defaultSize,
            color: 'red',
            x: offsetX - (gCtx.measureText(defaultText).width / 2),
            y: offsetY + (defaultSize / 2)
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
function onChangeSize(size) {
    if (!gSelectedLine) return;
    if (gSelectedLine.size + size < 12) return;
    gSelectedLine.size += size;
    clearCanvas();
    drawAll();
}
function onStartDragging(ev) {
    let selectedLine = getLineByIndexes(ev.offsetX, ev.offsetY);
    if (!selectedLine) return
    gSelectedLine = selectedLine;
    ev.target.addEventListener("mousemove", onMoveStuff);
    ev.target.addEventListener("mouseup", onStopMovingStuff);
}
function onMoveStuff(ev) {
    gSelectedLine.x = ev.offsetX - (gCtx.measureText(gSelectedLine.text).width / 2);
    gSelectedLine.y = ev.offsetY + (gSelectedLine.size / 2);
    clearCanvas();
    drawAll();
}
function onStopMovingStuff(ev) {
    ev.target.removeEventListener("mousemove", onMoveStuff);
    ev.target.removeEventListener("mouseup", onStopMovingStuff);
}
function getLineByIndexes(x, y) {
    return gLines.find(line => {
        gCtx.font = line.size + 'px impact';
        var textWidth = gCtx.measureText(line.text).width;
        return line.x + textWidth >= x &&
            line.x <= x &&
            line.y - line.size <= y &&
            line.y >= y
    });
}