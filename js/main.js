'use strict'
const defaultText = 'Text Here';
const defaultSize = 40;
const defaultFont = 'Impact';


var gCtx;
var gLines;
var gSelectedLine;
var gElCanvas
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
    document.querySelector('.editor').classList.remove('hidden');
    gLines = getLines();
    gSelectedLine = gLines[0];
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    // resizeCanvas();
    drawAll();
}
function drawAll() {
    clearCanvas();
    drawImg(getMemeImgUrl());
    function drawImg(path) {
        gCtx.drawImage(gElImg, 0, 0, 500, 500);
        drawAllText();
    }
    function drawAllText() {
        gLines.forEach(line => drawText(line));
        function drawText(line) {
            gCtx.lineWidth = '2';
            gCtx.strokeStyle = line.strokeColor;
            gCtx.fillStyle = line.textColor;
            gCtx.font = line.size + 'px ' + line.font;
            gCtx.textAlign = 'left';
            gCtx.fillText(line.text, line.x, line.y);
            gCtx.strokeText(line.text, line.x, line.y);
        }
    }
    drawSelectedRect();
    function drawSelectedRect() {
        if (!gSelectedLine) return;
        gCtx.font = gSelectedLine.size + 'px ' + gSelectedLine.font;
        const textWidth = gCtx.measureText(gSelectedLine.text).width;
        gCtx.beginPath();
        gCtx.rect(gSelectedLine.x - 10, gSelectedLine.y - gSelectedLine.size, textWidth + 20, gSelectedLine.size + 5);
        gCtx.strokeStyle = 'white';
        gCtx.stroke();
    }
    function clearCanvas() {
        gCtx.clearRect(0, 0, 500, 500);
    }
}

function onCanvasClick(ev) {
    const { offsetX, offsetY } = ev;
    gSelectedLine = getLineByIndexes(offsetX, offsetY);
    if (!gSelectedLine) {
        gSelectedLine = {
            text: defaultText,
            font: defaultFont,
            size: defaultSize,
            textColor: 'white',
            strokeColor: 'black',
            x: offsetX - (gCtx.measureText(defaultText).width / 2),
            y: offsetY + (defaultSize / 2)
        };
        gLines.push(gSelectedLine);
    }
    document.querySelector('.fontSelect').value = gSelectedLine.font;
    var lineText = document.querySelector('.lineText');
    lineText.value = gSelectedLine.text;
    lineText.focus();
    drawAll();
}
function onInput(ev) {
    gSelectedLine.text = ev.target.value;
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
    drawAll();
}
function onDownload() {
    var tempSelectedLine = gSelectedLine;
    gSelectedLine = null;
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
    drawAll();
}
function onStartDragging(ev) {
    let selectedLine = getLineByIndexes(ev.offsetX, ev.offsetY);
    if (!selectedLine) return
    gSelectedLine = selectedLine;
    ev.target.addEventListener("mousemove", onMoveStuff);
    ev.target.addEventListener("mouseup", onStopMovingStuff);
    // ev.target.addEventListener("touchmove", onMoveStuff);
    // ev.target.addEventListener("touchend", onStopMovingStuff);
}
function onMoveStuff(ev) {

    gSelectedLine.x = ev.offsetX - (gCtx.measureText(gSelectedLine.text).width / 2);
    gSelectedLine.y = ev.offsetY + (gSelectedLine.size / 2);
    drawAll();
}
function onStopMovingStuff(ev) {
    ev.target.removeEventListener("mousemove", onMoveStuff);
    ev.target.removeEventListener("mouseup", onStopMovingStuff);
    // ev.target.removeEventListener("touchmove", onMoveStuff);
    // ev.target.removeEventListener("touchend", onStopMovingStuff);
}
function getLineByIndexes(x, y) {
    return gLines.find(line => {
        gCtx.font = line.size + 'px ' + line.font;
        var textWidth = gCtx.measureText(line.text).width;
        return line.x + textWidth >= x &&
            line.x <= x &&
            line.y - line.size <= y &&
            line.y >= y
    });
}
function resizeCanvas() {
    var elContainer = document.querySelector('.canvas_container');
    // Note: changing the canvas dimension this way clears the canvas
    
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}
function onChangeFont(el){
    if(!gSelectedLine) return;
    gSelectedLine.font = el.value;
    drawAll();
}
function onChangeTextColor(el){
    if(!gSelectedLine) return;
    gSelectedLine.textColor = el.value;
    drawAll();
}
function onChangeStrokeColor(el){
    if(!gSelectedLine) return;
    gSelectedLine.strokeColor = el.value;
    drawAll();
}
function toggleMenu() {
    document.body.classList.toggle('menu-open');
}