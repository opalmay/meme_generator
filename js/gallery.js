'use strict'
var filterStr = '';

function initGallery() {
    let gallery = document.querySelector('.gallery');
    gallery.classList.remove('hidden')
    document.querySelector('.editor').classList.add('hidden');
    generateKeywords();
    generateGallery();
}
function generateGallery() {
    let gallery = document.querySelector('.gallery');
    let strHtml = '';
    var filteredKeywords = getFilteredImages(filterStr);

    console.log(filterStr);
    for (let i = 0; i < filteredKeywords.length; i++) {
        strHtml += `<img onclick="onImgClick(${filteredKeywords[i].id})" src="${getMemeImgUrl(filteredKeywords[i].id)}">`;
    }
    console.log(filteredKeywords);
    gallery.innerHTML = strHtml;
}
function generateKeywords() {
    var mapTags = getKeywords();
    var strHtml = '';
    for (const key in mapTags) {
        var fontSize = 20 + mapTags[key] / 2;
        strHtml += `<button style="font-size:${fontSize}px" onClick="onFilterClick('${key}')">${key}</button>`;
    }
    document.querySelector('.tags').innerHTML = strHtml;
}
function onFilterClick(filter) {
    filterStr = filter;
    keywordClicked(filter);
    generateKeywords();
    generateGallery();
}
function onImgClick(id) {
    initService(id);
    initEditor();
}