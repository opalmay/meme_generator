'use strict'
const imgCount = 18;

function initGallery() {
    let gallery = document.querySelector('.gallery');
    gallery.classList.remove('hidden')
    document.querySelector('.editor').classList.add('hidden');
    let strHtml = '';
    for (let i = 1; i <= imgCount; i++) {
        strHtml += `<div><img onclick="onImgClick(${i})" src="img/${i}.jpg"></div>`;
    }
    gallery.innerHTML = strHtml;
}
function onImgClick(id) {
    initService(id);
    initEditor();
}