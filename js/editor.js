'use strict'
const defaultText = 'Text Here';
const defaultSize = 40;
const defaultFont = 'Impact';

var gCtx;
var gElCanvas
var gElImg;
var gMoveDifferenceX, gMoveDifferenceY;

//EDITOR
function initEditor() {
    gElImg = new Image();
    gElImg.src = getMemeImgUrl();
    document.querySelector('.gallery').classList.add('hidden');
    document.querySelector('.tags').classList.add('hidden');
    document.querySelector('.editor').classList.remove('hidden');
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    resizeCanvas();
    onUpdateSelectedLine();
    drawAll();
}
function resizeCanvas() {
    var elContainer = document.querySelector('.canvas_container');
    gElCanvas.width = Math.min(gElImg.width, elContainer.offsetWidth);
    gElCanvas.height = gElCanvas.width / (gElImg.width / gElImg.height);
}
function drawAll(isDrawSelectedRect = true) {
    clearCanvas();
    drawImg();
    function drawImg() {
        gCtx.drawImage(gElImg, 0, 0, gElCanvas.width, gElCanvas.height);
        drawAllText();
    }
    function drawAllText() {
        getLines().forEach(line => drawText(line));
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
    if (isDrawSelectedRect) drawSelectedRect();
    function drawSelectedRect() {
        let selectedLine = getSelectedLine();
        if (!selectedLine) return;
        const textWidth = measureLine(selectedLine);
        gCtx.beginPath();
        gCtx.rect(selectedLine.x - 10, selectedLine.y - selectedLine.size, textWidth + 20, selectedLine.size + 5);
        gCtx.strokeStyle = 'white';
        gCtx.stroke();
    }
    function clearCanvas() {
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
    }
}

function onCanvasClick(ev) {
    const { offsetX, offsetY } = ev;
    let selectedLine = getLineByIndexes(offsetX, offsetY);
    if (!selectedLine) {
        selectedLine = {
            text: defaultText,
            font: defaultFont,
            size: defaultSize,
            textColor: 'white',
            strokeColor: 'black',
            y: offsetY + (defaultSize / 2)
        };
        selectedLine.x = offsetX - (measureLine(selectedLine) / 2);
        addLine(selectedLine);
    }
    setSelectedLine(selectedLine);
    onUpdateSelectedLine();
    drawAll();
}
function onInput(ev) {
    changeSelectedLineText(ev.target.value);
    drawAll();
}
function onRemoveLine() {
    removeSelectedLine();
    onUpdateSelectedLine();
    drawAll();
}
function onUpdateSelectedLine() {
    let selectedLine = getSelectedLine();
    let font = '';
    let text = '';
    var elLineText = document.querySelector('.lineText');
    if (selectedLine) {
        font = selectedLine.font;
        text = selectedLine.text;
        elLineText.focus();
    }
    document.querySelector('.fontSelect').value = font;
    elLineText.value = text;
}
function onDownload() {
    drawAll(false);
    setTimeout(() => {
        var link = document.createElement('a');
        link.download = 'meme.jpg';
        link.href = document.querySelector('canvas').toDataURL();
        link.click();
        drawAll();
    }, 50);
}
// function onShareToFB() {
//     var tempSelectedLine = gSelectedLine;
//     gSelectedLine = null;
//     drawAll();
//     setTimeout(() => {
//         // var link = document.createElement('a');
//         // link.download = 'meme.jpg';
//         console.log(document.querySelector('canvas').toDataURL())
//         let u = uploadImage(document.querySelector('canvas').toDataURL());

//         // link.click();
//         gSelectedLine = tempSelectedLine;
//         // let t = 'Check out the meme I\'ve made!';
//         // window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(u) + '&t=' + encodeURIComponent(t), 'sharer', 'toolbar=0,status=0,width=626,height=436');
//     }, 50);
// }
// function uploadImage(file){
//     var fd = new FormData();
//     fd.append("image", file); // Append the file
//     // fd.append("Authorization", "Client-ID {{28587fd13d53d7e}}");
//     // Get your own key: http://api.imgur.com/

//     // Create the XHR (Cross-Domain XHR FTW!!!)
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", "https://api.imgur.com/3/image"); // Boooom!
//     xhr.setRequestHeader('Authorization','Client-ID 28587fd13d53d7e');
//     xhr.onload = function() {
//       // Big win!
//       // The URL of the image is:
//       console.log(xhr.responseText);
//       return JSON.parse(xhr.responseText).upload.links.imgur_page;
//      }
//      // Ok, I don't handle the errors. An exercice for the reader.
//      // And now, we send the formdata
//      xhr.send(file);
//    }

function onChangeSize(size) {
    let selectedLine = getSelectedLine();
    if (!selectedLine) return;
    if (selectedLine.size + size < 12) return;
    changeSelectedLineSize(selectedLine.size + size);
    drawAll();
}

function onStartDragging(ev) {
    const { x, y } = getRelativeCoords(ev);
    let selectedLine = getLineByIndexes(x, y);
    setSelectedLine(selectedLine);
    if (!selectedLine) return
    selectedLine = selectedLine;
    gMoveDifferenceX = x - selectedLine.x;
    gMoveDifferenceY = y - selectedLine.y;
    ev.target.addEventListener('mousemove', onMoveStuff);
    ev.target.addEventListener('mouseup', onStopMovingStuff);
    ev.target.addEventListener('touchmove', onMoveStuff);
    ev.target.addEventListener('touchend', onStopMovingStuff);
}
function onMoveStuff(ev) {
    ev.preventDefault();
    const { x, y } = getRelativeCoords(ev);
    moveSelectedLine(x - gMoveDifferenceX, y - gMoveDifferenceY);
    drawAll();
}
function getRelativeCoords(ev) {
    const elRect = ev.target.getBoundingClientRect();
    return ev.type.includes('mouse') ? { x: ev.offsetX, y: ev.offsetY } :
        { x: ev.touches[0].pageX - elRect.left, y: ev.touches[0].pageY - elRect.top };
}
function onStopMovingStuff(ev) {
    ev.target.removeEventListener('mousemove', onMoveStuff);
    ev.target.removeEventListener('mouseup', onStopMovingStuff);
    ev.target.removeEventListener('touchmove', onMoveStuff);
    ev.target.removeEventListener('touchend', onStopMovingStuff);
}
function onChangeFont(el) {
    changeSelectedLineFont(el.value);
    drawAll();
}
function onChangeTextColor(el) {
    changeSelectedLineTextColor(el.value);
    drawAll();
}
function onChangeStrokeColor(el) {
    changeSelectedLineStrokeColor(el.value);
    drawAll();
}
function toggleMenu() {
    document.body.classList.toggle('menu-open');
}