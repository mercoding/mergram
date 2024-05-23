import * as language from './language.js';

function changeFolowerSectionPosition() {
    if(!document.getElementById('followerHeadPosition') || !document.getElementById('followerSidePosition')) return;
    if(window.innerWidth < 1160) {
        document.getElementById('followerHeadPosition').classList.remove('d-none');
        document.getElementById('followerSidePosition').classList.add('d-none');
    }
    else {
        document.getElementById('followerHeadPosition').classList.add('d-none');
        document.getElementById('followerSidePosition').classList.remove('d-none');
    }
}


function smallScreenNavigation() {
    if(!document.getElementById('left') || !document.querySelector('.pageLogo')) return;
    let div = document.getElementById('left');
    let p = div.querySelectorAll('p');
    if(window.innerWidth < 1160) {
        document.querySelector('.pageLogo').classList.remove('d-none');
        p.forEach(element => { element.classList.add('d-none'); });
        document.querySelector('.left').style.setProperty('box-shadow', '0 0 5px 0px rgba(0, 0, 0, 0.8)');
        
    }
    else {
        document.querySelector('.pageLogo').classList.add('d-none');
        p.forEach(element => { element.classList.remove('d-none'); });
        document.querySelector('.left').style.setProperty('box-shadow', '0 0 5px 0px rgba(0, 0, 0, 0.8)');
        
    }

    if(window.innerWidth < 786) {
        (language.getLanguage() == 'english') ? document.querySelector('.dropdownLanguage').style.setProperty('margin', '0 0 0 50px') :  document.querySelector('.dropdownLanguage').style.setProperty('margin', '0 0 0 20px');
    }
    else {
        document.querySelector('.dropdownLanguage').style.setProperty('margin', '0 0 0 20px');
    }
}


 export function checkScreenSize() {
    changeFolowerSectionPosition();
    smallScreenNavigation();
}


window.onresize = checkScreenSize;

