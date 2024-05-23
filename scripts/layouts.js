const layout0 = [
    { id: 'head', name: 'header', url: './templates/empty.html' },
    { id: 'left', name: 'aside', url: './templates/empty.html' },
    { id: 'dropdown', name: 'dropdown', url: './templates/dropdown.html' },
    { id: 'center', name: 'main', url: './templates/login.html' },
    { id: 'right', name: 'follower', url: './templates/empty.html' },
    { id: 'foot', name: 'footer', url: './templates/start/footer.html' }
];


const layout1 = [
    { id: 'head', name: 'header', url: './templates/start/header.html' },
    { id: 'left', name: 'aside', url: './templates/start/aside.html' },
    { id: 'dropdown', name: 'dropdown', url: './templates/dropdown.html' },
    { id: 'center', name: 'main', url: './templates/start/main.html' },
    { id: 'right', name: 'follower', url: './templates/start/follower.html' },
    { id: 'foot', name: 'footer', url: './templates/start/footer.html' }
];



const layout2 = [
    { id: 'head', name: 'header', url: './templates/empty.html' },
    { id: 'left', name: 'aside', url: './templates/start/aside.html' },
    { id: 'dropdown', name: 'dropdown', url: './templates/dropdown.html' },
    { id: 'center', name: 'imprint', url: './templates/imprint/imprint.html' },
    { id: 'right', name: 'empty', url: './templates/empty.html' },
    { id: 'foot', name: 'footer', url: './templates/start/footer.html' }
];


const layout3 = [
    { id: 'head', name: 'header', url: './templates/empty.html' },
    { id: 'left', name: 'aside', url: './templates/start/aside.html' },
    { id: 'dropdown', name: 'dropdown', url: './templates/dropdown.html' },
    { id: 'center', name: 'impressum', url: './templates/imprint/impressum.html' },
    { id: 'right', name: 'empty', url: './templates/empty.html' },
    { id: 'foot', name: 'footer', url: './templates/start/footer.html' }
];


const layout4 = [
    { id: 'head', name: 'header', url: './templates/empty.html' },
    { id: 'left', name: 'aside', url: './templates/start/aside.html' },
    { id: 'dropdown', name: 'dropdown', url: './templates/dropdown.html' },
    { id: 'center', name: 'dataprotection', url: './templates/dataprotection/dataprotection.html' },
    { id: 'right', name: 'empty', url: './templates/empty.html' },
    { id: 'foot', name: 'footer', url: './templates/start/footer.html' }
];


const layout5 = [
    { id: 'head', name: 'header', url: './templates/empty.html' },
    { id: 'left', name: 'aside', url: './templates/start/aside.html' },
    { id: 'dropdown', name: 'dropdown', url: './templates/dropdown.html' },
    { id: 'center', name: 'datenschutz', url: './templates/dataprotection/datenschutz.html' },
    { id: 'right', name: 'empty', url: './templates/empty.html' },
    { id: 'foot', name: 'footer', url: './templates/start/footer.html' }
];


const layout6 = [
    { id: 'head', name: 'header', url: './templates/start/header.html' },
    { id: 'left', name: 'aside', url: './templates/start/aside.html' },
    { id: 'dropdown', name: 'dropdown', url: './templates/dropdown.html' },
    { id: 'center', name: 'main', url: './templates/start/main.html' },
    { id: 'right', name: 'follower', url: './templates/start/follower.html' },
    { id: 'foot', name: 'footer', url: './templates/start/footer.html' }
];


export function getLayout(i) {
    let layout;
    switch (i) {
        case 0: layout = layout0; break;
        case 1: layout = layout1; break;
        case 2: layout = layout2; break;
        case 3: layout = layout3; break;
        case 4: layout = layout4; break;
        case 5: layout = layout5; break;
        case 6: layout = layout6; break;
    }
    return layout;
}