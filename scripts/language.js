import * as content from './content.js';
import * as layouts from './layouts.js';


let language = 'german';


export function checkLanguage() {
    if (language == 'german') {
        setGerman();
    }
    else {
        setEnglish();
    }
}


export function getLanguage() {
    if (!localStorage.getItem('language')) {
        localStorage.setItem('language', 'english');
    }
    language = localStorage.getItem('language');
    return language;
}


function switchLanguage() {
    (language == 'german') ? setEnglish() : setGerman();
    translateCurrentPage();
}


function changeLanguage() {
    let selectedItem;
    let languageSelectBox = document.querySelectorAll('.language > select');
    languageSelectBox.forEach((item) => { selectedItem = item.value });
    (selectedItem == 1) ? setGerman() : setEnglish();
    translateCurrentPage();
}


function setGerman() {
    language = 'german';
    document.querySelectorAll('.dropdownLanguage > select').forEach((item) => {
        item.value = 1;
        item.options[0].text = 'Deutsch';
        item.options[0].setAttribute('selected', 'selected');
        item.options[1].removeAttribute('selected', 'selected');

    });
    document.querySelectorAll('.dropdownLanguage > img').forEach((item) => { item.setAttribute('src', 'img/german_flag.png'); });
    localStorage.setItem('language', 'german');
    document.querySelectorAll('.dropdownImprint').forEach((item) => { item.setAttribute('onclick', `content(3)`); });
    document.querySelectorAll('.dropdownImprint > p').forEach((item) => { item.innerHTML = 'Impressum'; });
    document.querySelectorAll('.dropdownDataprotection').forEach((item) => { item.setAttribute('onclick', `content(5)`); });
    document.querySelectorAll('.dropdownDataprotection > p').forEach((item) => { item.innerHTML = 'Datenschutz'; });
}


function setEnglish() {
    language = 'english';
    document.querySelectorAll('.dropdownLanguage > select').forEach((item) => {
        item.value = 2;
        item.options[0].text = 'German';
        item.options[0].removeAttribute('selected', 'selected');
        item.options[1].setAttribute('selected', 'selected');
    });
    document.querySelectorAll('.dropdownLanguage > img').forEach((item) => { item.setAttribute('src', 'img/british_flag.png'); });
    localStorage.setItem('language', 'english');
    document.querySelectorAll('.dropdownImprint').forEach((item) => { item.setAttribute('onclick', `content(2)`); });
    document.querySelectorAll('.dropdownImprint > p').forEach((item) => { item.innerHTML = 'Imprint'; });
    document.querySelectorAll('.dropdownDataprotection').forEach((item) => { item.setAttribute('onclick', `content(4)`); });
    document.querySelectorAll('.dropdownDataprotection > p').forEach((item) => { item.innerHTML = 'Data Protection'; });
}


function translateCurrentPage() {    
    switch (language) {
        case "german":
            if (content.currentLayout[3].name == "imprint") content.content(3);
            else if (content.currentLayout[3].name == "dataprotection") content.content(5);
            else content.content(1);
            break;

        case "english":
            if (content.currentLayout[3].name == "impressum") content.content(2);
            else if (content.currentLayout[3].name == "datenschutz") content.content(4);
            else content.content(1);
            break;
    }
    content.headerContent();
    content.navbarContent();
}

window.switchLanguage = switchLanguage;
window.changeLanguage = changeLanguage;