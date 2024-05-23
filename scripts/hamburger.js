let hamburgerIsActive = false;

export function hamburgerWasClicked() {
    switchHamburgerActivity();
    if(hamburgerIsActive) {
        document.getElementById('menu-toggle').checked = true;
        document.getElementById('dropdown').classList.remove('d-none');
        if(window.innerWidth < 786)
            document.querySelector('.left').style.setProperty('box-shadow', 'none');
    }
    else {
        document.getElementById('menu-toggle').checked = false;
        document.getElementById('dropdown').classList.add('d-none');
        if(window.innerWidth < 786)
            document.querySelector('.left').style.setProperty('box-shadow', '0 -5px 5px -3px rgba(0, 0, 0, 0.3)');
    }
} 


export function switchHamburgerActivity() {
    hamburgerIsActive = !hamburgerIsActive;
}

export function getHamburgerButtonStatus() {
    return hamburgerIsActive;
}


window.hamburgerWasClicked = hamburgerWasClicked;