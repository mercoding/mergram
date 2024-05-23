import * as layouts from './layouts.js';
import * as language from './language.js';
import * as resize from './resize.js';
import * as hamburger from './hamburger.js';

const sections = ['header', 'aside', 'main', 'footer'];
export let currentLayout, userJSON;
let data = JSON.parse(localStorage.getItem('data')), loggedUser = "Bob", logIn = "false", profiles = [], userAndFollowingContent = [];
let forYou = true, forYouContentList = [];


export async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        document.file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(document.file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


function template(id, name) {
    var contentId = document.getElementById(id);
    contentId.removeAttribute("w3-include-html");
    contentId.setAttribute("w3-include-html", name);
}


function set(content) {
    for (let i = 0; i < sections.length; i++) {
        for (let j = 0; j < content.length; j++) {
            if (content[j].id != sections[i]) template(content[j].id, './templates/empty.html');
            template(content[j].id, content[j].url);
        }
    }
}


function getLoginForm() {
    let p = (language.getLanguage() == 'english') ? 'Log In' : 'Anmelden';
    return /*html*/`
        <img src="./img/smartphoneBG.jpg" alt="Image">
        <div class="login">
            <h1>mergram</h1>
            <div id="loginForm" class="loginForm">
                <input id="nickname" placeholder="Benutzername" type="text">
                <input id="password" placeholder="Passwort" type="password">
                <button type="submit" onclick="checkLoginData()">${p}</button>
            </div>
        </div>
    `;
}


function setLoginContent() {
    includeHTML().then(res => {
        let loginContainerId = document.getElementById('loginContainer');
        loginContainerId.innerHTML = '';
        loginContainerId.innerHTML += getLoginForm();
        let randomProfile = Math.floor(Math.random() * 9);
        document.getElementById('nickname').setAttribute('placeholder', profiles.user[randomProfile].nickname);
        document.getElementById('nickname').value = profiles.user[randomProfile].nickname;
        document.getElementById('password').setAttribute('placeholder', '****');
        document.getElementById('password').value = '1234';
    }).catch(err => console.log(err));
}


function searchEntry(nickname) {
    data = JSON.parse(localStorage.getItem('data'));
    if (data == null) data = loadJSON('./data/user/default_data.json');
    for (let i = 0; i < data.user.length; i++) if (data.user[i].nickname == nickname) return true;
    return false;
}


function createNewUser(nickname) {
    let newUser = loadJSON('./data/user/new_user.json');
    newUser.user[0].nickname = nickname;
    newUser.user[0].firstname = 'unknown';
    newUser.user[0].lastname = 'unknown';
    data.user.push(newUser.user[0]);
    profiles.user.push(newUser.user[0]);
    localStorage.setItem('data', JSON.stringify(data));
}


function checkLoginData() {
    let nickname = document.getElementById('nickname').value;
    let password = document.getElementById('password').value;
    if (nickname == '' || password == '') return;
    if (!searchEntry(nickname)) createNewUser(nickname);
    loggedUser = nickname;
    localStorage.setItem('LogIn', true);
    localStorage.setItem('loggedUser', loggedUser);
    content(1);
}


function login() {
    console.log('login');
    document.getElementById('head').classList.add('d-none');
    document.getElementById('left').classList.add('d-none');
    document.getElementById('right').classList.add('d-none');
    document.getElementById('layout').classList.add('loginLayout');
    document.getElementById('layout').classList.remove('layout');
    setMargin(64, 0, 0, 0);
    setLoginContent();
}


function userPage() {
    //console.log('start');
    document.getElementById('layout').classList.remove('loginLayout');
    document.getElementById('layout').classList.add('layout');
    document.getElementById('head').classList.remove('d-none');
    document.getElementById('left').classList.remove('d-none');
    document.getElementById('right').classList.remove('d-none');
    if (!localStorage.getItem('data')) localStorage.setItem('data', JSON.stringify(loadJSON('./data/user/default_data.json')));
    data = JSON.parse(localStorage.getItem('data'));
    profiles = data;
    let user = document.querySelectorAll('.profiles');
    loggedUser = localStorage.getItem('loggedUser');
    let currentUserIndex = findIndex(profiles, loggedUser);
    user.forEach((element) => { element.innerHTML = addUser(profiles, currentUserIndex) });
    user.forEach((element) => { element.innerHTML += addAllUser(data); });
}


function clearOverlay() {
    document.getElementById('overlay').classList.remove('d-none');
    document.querySelector('html').style.setProperty('overflow-y', 'hidden');
    let containerId = document.getElementById('overlayContentContainer');
    containerId.innerHTML = '';
    return containerId;
}


function setProfileOverlayContainer() {
    return /*html*/`
        <div class="profileOverlayContainer" id="profileOverlayContainer">
            <div class="profileOverlayHead">
                <p></p>
                <img onclick="closeOverlay()" class="closeButton" src="./svg/ic--round-close.svg" alt="Close Button">
            </div>
            <div class="seperator"></div>
            <div class="profilesOverlay"></div>
        </div>`;
}


function addProfile(which, src, nickname, firstname, lastname) {
    let rm = (language.getLanguage() == 'english') ? 'remove' : 'Entfernen';
    return /*html*/`
        <div class="userOverlayContainer">
            <div class="userOverlay">
                <img src="${src}" alt="Avatar">
                <div class="userInfo">
                    <p class="userNickname">${nickname}</p>
                    <p class="userName">${firstname} ${lastname}</p>
                </div>
            </div>
            <button onclick="remove('${which}', '${nickname}')" class="removeFollowButton">${rm}</button>
        </div>  
    `;
}


function removeNickname(arr, nickname) {
    return arr.filter(f => f !== nickname);
}



function remove(which, nickname) {
    console.log("remove " + which + " " + nickname);
    const i = findIndex(data, loggedUser);
    const j = findIndex(data, nickname);
    data.user[i].followed = removeNickname(data.user[i].followed, nickname);
    data.user[j].follower = removeNickname(data.user[j].follower, loggedUser);
    localStorage.setItem('data', JSON.stringify(data));
    profilePage();
    if (which == "followed") includeHTML().then(res => {editProfileFollowed();}).catch(err => console.log(err));
    else if (which == "follower") includeHTML().then(res => {editProfileFollower();}).catch(err => console.log(err));    
}


function prepareEditProfile(which) {
    let containerId = clearOverlay();
    containerId.innerHTML += setProfileOverlayContainer();
    document.getElementById('overlayCloseButton').classList.add('d-none');
    if(which == 'follower') document.querySelector('.profileOverlayHead > p').innerHTML = 'Follower';
    else document.querySelector('.profileOverlayHead > p').innerHTML = (language.getLanguage() == 'english') ? 'Followed' : 'Gefolgt';
    document.querySelector('.profileOverlayHead > img').style.setProperty('filter', 'invert(0%) sepia(100%) saturate(0%) hue-rotate(180deg) brightness(100%) contrast(100%)');
}


function editProfileFollowed() {
    prepareEditProfile('followed');

    data.user[findIndex(data, loggedUser)].followed.forEach((followed) => {
        const userIndex = findIndex(data, followed);
        document.querySelector('.profilesOverlay').innerHTML += addProfile("followed", data.user[userIndex].avatar, data.user[userIndex].nickname, data.user[userIndex].firstname, data.user[userIndex].lastname);
    });
}


function editProfileFollower() {
    prepareEditProfile('follower');

    data.user[findIndex(data, loggedUser)].follower.forEach((follower) => {
        const userIndex = findIndex(data, follower);
        document.querySelector('.profilesOverlay').innerHTML += addProfile("follower", data.user[userIndex].avatar, data.user[userIndex].nickname, data.user[userIndex].firstname, data.user[userIndex].lastname);
    });
}


function addProfileContainer(array, index) {
    let p1 = (language.getLanguage() == 'english') ? 'posts' : 'Beiträge';
    let p2 = (language.getLanguage() == 'english') ? 'follower' : 'Follower';
    let p3 = (language.getLanguage() == 'english') ? 'followed' : 'Gefolgt';
    return /*html*/`
        <div class="profileContainer">
            <img onclick="loadSpecificUserContent(${index})" src=${array.user[index].avatar} alt="Profil Image">
            <div class="profileInfo">
                <p class="profileNickname"><b>${array.user[index].nickname}</b></p>
                <div class="profileFollowContainer">
                    <p class="profileContributions">${array.user[index].posts.length} ${p1}</p>
                    <p onclick="editProfileFollower()" class="profileFollower">${array.user[index].follower.length} ${p2}</p>
                    <p onclick="editProfileFollowed()" class="profileFollowed">${array.user[index].followed.length} ${p3}</p>
                </div>
                <p class="profileName">${array.user[index].firstname} ${array.user[index].lastname}</p>
            </div>
        </div>
    `;
}


function profilePage() {
    //console.log('profile');
    currentLayout = layouts.getLayout(6);
    set(currentLayout);
    includeHTML().then(res => {
        language.getLanguage();
        language.checkLanguage();
        headerContent();
        navbarContent();
        resize.checkScreenSize();
        window.scrollTo(0, 0);
        document.querySelector('.headercontainer').classList.add('d-none');
        document.querySelector('.follower').classList.add('d-none');
        document.querySelector('.right').classList.add('d-none');
        let main = document.getElementById('mainContentContainer');
        main.innerHTML = '';
        main.innerHTML += addProfileContainer(data, findIndex(data, loggedUser));
        paintItemBlack('profile');
        window.scrollTo(0, 0);
    }).catch(err => console.log(err));
}


function findIndex(array, nickname) {
    let index = 0;
    for (let i = 0; i < array.user.length - 1; i++) {
        if (array.user[i].nickname == nickname) break;
        index++;
    }
    return index;
}

function followButton(u) {
    const loggedUserIndex = findIndex(data, loggedUser);
    data.user[u].follower.push(data.user[loggedUserIndex].nickname);
    data.user[loggedUserIndex].followed.push(data.user[u].nickname);
    localStorage.setItem('data', JSON.stringify(data));
    userPage();
    loadInnerContent();
}


function addUser(array, index) {
    return /*html*/`
        <div class="user">
            <img onclick="loadSpecificUserContent(${index})" src=${array.user[index].avatar} alt="Profil Image">
            <div class="userInfo">
                <p class="userNickname"><b>${array.user[index].nickname}</b></p>
                <p class="userName">${array.user[index].firstname} ${array.user[index].lastname}</p>
            </div>
            ${(array.user[index].nickname != loggedUser ^ array.user[index].follower.some(str => str.includes(loggedUser))) ? addFollowButtons(index) : ''}
        </div>
    `;
}


function addFollowButtons(u) {
    let p1 = (language.getLanguage() == 'english') ? 'follow' : 'Folgen';
    return /*html*/ `
        <div onclick="followButton(${u})" class="followButton">
            <p class="lang">${p1}</p>
        </div>
    `;
}

function addAllUser(array) {
    let userString = "";
    array.user.forEach((element, index) => { userString += element = (element.nickname != loggedUser) ? addUser(array, index) : element = ''; });
    return userString;
}

function setMargin(h, r, b, l) {
    document.getElementById('center').style.setProperty('margin', `${h}px ${r}px ${b}px ${l}px`);
}


function startPage() {
    profiles = loadJSON('./data/user/profiles.json');
    if (!localStorage.getItem('LogIn'))
        localStorage.setItem('LogIn', false);
    logIn = localStorage.getItem('LogIn');
    if (logIn == "false") content(0);
    else content(1);
}


export function headerContent() {
    let forYouButton = document.querySelector('.headercontainer > .foryouButton');
    let followerButton = document.querySelector('.headercontainer > .followerButton');
    if (!forYouButton && !followerButton) return;
    forYouButton.innerHTML = (language.getLanguage() == 'english') ? 'For you' : 'Für dich';
    followerButton.innerHTML = (language.getLanguage() == 'english') ? 'Followed' : 'Gefolgt';
}


export function navbarContent() {
    let navId = document.getElementById('sidebar');
    if(!navId) return;
    let startPage = navId.querySelector('.startPage > p');
    let search = navId.querySelector('.search > p');
    let proile = navId.querySelector('.profil > p');
    let burgermenu = navId.querySelector('.burgermenu > p');
    startPage.innerHTML = (language.getLanguage() == 'english') ? 'Start' : 'Startseite';
    search.innerHTML = (language.getLanguage() == 'english') ? 'Search' : 'Suche';
    proile.innerHTML = (language.getLanguage() == 'english') ? 'Profile' : 'Profil';
    burgermenu.innerHTML = (language.getLanguage() == 'english') ? 'More' : 'Mehr';
    document.querySelector('.dropdownLogOut > p').innerHTML = (language.getLanguage() == 'english') ? 'Log Out' : 'Abmelden';
    (language.getLanguage() == 'english' && window.innerWidth < 768) ? document.querySelector('.dropdownLanguage').style.setProperty('margin', '0 0 0 50px') : document.querySelector('.dropdownLanguage').style.setProperty('margin', '0 0 0 20px');
}


function changeItemFontAndIcon(query, fontSize, img = null) {
    if (img) query.setAttribute('src', img);
    query.style.setProperty('font-weight', fontSize);
}


function paintItemBlack(which) {
    let startItem = document.querySelector('.startPage');
    let profileItem = document.querySelector('.profil');
    if (which == 'start') {
        changeItemFontAndIcon(startItem.querySelector('* > img'), '700', './svg/teenyicons--home-solid.svg');
        changeItemFontAndIcon(startItem.querySelector('* > p'), '700');
        changeItemFontAndIcon(profileItem.querySelector('* > img'), '400');
    }
    else if (which == 'profile') {
        changeItemFontAndIcon(startItem.querySelector('* > img'), '400', './svg/teenyicons--home-outline.svg');
        changeItemFontAndIcon(startItem.querySelector('* > p'), '400');
        changeItemFontAndIcon(profileItem.querySelector('* > p'), '700');
    }
}


export function content(layout) {
    if (layout == 0) login();
    setMargin(0, 64, 0, 64);
    currentLayout = layouts.getLayout(layout);
    set(currentLayout);

    includeHTML().then(res => {
        // Do something else after loaded layout
        language.getLanguage();
        language.checkLanguage();
        headerContent();
        navbarContent();
        resize.checkScreenSize();
        window.scrollTo(0, 0);
        if (hamburger.getHamburgerButtonStatus()) hamburger.hamburgerWasClicked();
        //console.log('ready');
        if (layout == 1) {
            userPage();
            forYouContentList = getRandomIndiciesList();
            loadInnerContent();
            paintItemBlack('start');
        }
    }).catch(err => console.log(err));
}


function timestamp_sort(a, b) {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
}

function followerButtonWasClicked() {
    forYou = false;
    document.querySelector('.followerButton').style.setProperty('color', 'rgba(0, 0, 0, 1');
    document.querySelector('.foryouButton').style.setProperty('color', 'rgba(0, 0, 0, .3');
    loadInnerContent();
}


function collectSpecificUserContent(userIndex) {
    let userContent = {};
    data.user.forEach((user, index) => { if (userIndex == index) userContent = user; });
    return userContent;
}


function collectFollowingContent() {
    let userIndex = findIndex(data, loggedUser);
    let followed = [], userContent = collectSpecificUserContent(userIndex);
    userContent.followed.forEach((f) => {
        let next = findIndex(data, f);
        data.user.forEach((user, index) => { if (next == index) followed.push(user); });
    });

    userAndFollowingContent = followed; //.concat(userContent).reverse();
    let sortedArray = [];
    userAndFollowingContent.forEach((item) => { item.posts.forEach((p) => { sortedArray.push(p); }); });
    sortedArray.sort(timestamp_sort);

    return sortedArray;
}


function forYouButtonWasClicked() {
    forYou = true;
    document.querySelector('.followerButton').style.setProperty('color', 'rgba(0, 0, 0, .3');
    document.querySelector('.foryouButton').style.setProperty('color', 'rgba(0, 0, 0, 1');
    loadInnerContent();
}


function collectForYouContent() {
    let userContent = [];
    data.user.forEach((u, i) => {
        const rand = Math.floor(Math.random() * u.posts.length);
        userContent.push(u.posts[forYouContentList[i]]);
    });
    userContent.sort(timestamp_sort);
    return userContent;
}


function getRandomIndiciesList() {
    let list = [];
    data.user.forEach((u) => {
        const rand = Math.floor(Math.random() * u.posts.length);
        list.push(rand);
    });
    return list;
}


function getPostId(postIdStr) {
    return postIdStr.split(".");
}


function loadInnerContent() {
    if (!localStorage.getItem('data')) localStorage.setItem('data', JSON.stringify(loadJSON('./data/user/default_data.json')));
    data = JSON.parse(localStorage.getItem('data'));
    let sortedArray = (forYou) ? collectForYouContent() : collectFollowingContent();
    iterateContentArray(sortedArray);
}


function loadSpecificUserContent(i) {
    let main = document.getElementById('mainContentContainer');
    let content = collectSpecificUserContent(i);
    main.innerHTML = '';
    iterateContentArray(content.posts.reverse());
}


function iterateContentArray(array) {
    let main = document.getElementById('mainContentContainer');
    main.innerHTML = '';
    for (let i = 0; i < array.length; i++) {
        if (array[i] != null) {
            main.innerHTML += parseContentToHTML(array, i, getPostId(array[i].id)[0], getPostId(array[i].id)[1]);
            checkLikes(getPostId(array[i].id)[0], getPostId(array[i].id)[1]);
            main.innerHTML += /*html*/`<div class="comments" id="user${getPostId(array[i].id)[0]}_post${getPostId(array[i].id)[1]}_comments">`;
            const postId = document.getElementById(`user${getPostId(array[i].id)[0]}_post${getPostId(array[i].id)[1]}_comments`);
            showComments(main, postId, getPostId(array[i].id)[0], getPostId(array[i].id)[1]);
            main.innerHTML += commentField(i, getPostId(array[i].id)[0], getPostId(array[i].id)[1]);
        }
    }
}


function getTimestamp() {
    return new Date(getTimestampString());
}


function getTimestampString() {
    const date = new Date();
    const currentDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const currentTime = date.toLocaleTimeString();
    return currentDate + " " + currentTime;
}


function calculateTimestampStringDuration(str) {
    let s = (language.getLanguage() == 'english') ? 'seconds' : 'Sekunden';
    let m = (language.getLanguage() == 'english') ? 'minutes' : 'Minuten';
    let h = (language.getLanguage() == 'english') ? 'hours' : 'Stunden';
    let d = (language.getLanguage() == 'english') ? 'day' : 'Tag';
    let days = (language.getLanguage() == 'english') ? 'days' : 'Tagen';
    const timestamp = getTimestamp();
    const postDate = new Date(str);
    let Difference_In_Time = timestamp - postDate;
    let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 60 * 60 * 24));
    const timeString = (Difference_In_Time < (1000 * 60)) ?
        Math.round(Difference_In_Time / 3600) + " " + s : (Difference_In_Time >= (1000 * 60) && Difference_In_Time < (1000 * 60 * 60)) ?
            Math.round(Difference_In_Time / (3600 * 60)) + " " + m : (Difference_In_Time < 1000 * 60 * 60 * 24) ?
                Math.round(Difference_In_Time / 24) + " " + h : (Difference_In_Days < 2) ?
                    Math.round(Difference_In_Days) + " " + d : Difference_In_Days + " " + days;
    return timeString;
}


function addFollowedImg() {
    return /*html*/`<img class="followedIconImg" src="svg/flat-color-icons--ok.svg" alt="followed">`;
}


function getAvatarInfo(j, postDuration) {
    return (language.getLanguage() == 'english') ? /*html*/`
            <p>${data.user[j].nickname} ${(data.user[j].nickname != loggedUser) ? data.user[j].follower.some(str => str.includes(loggedUser)) ? addFollowedImg() : addFollowButtons(j) : ''} 
                <img class="seperatorPoint lang" src="svg/tabler--point-filled.svg" alt="Seperator Image">${postDuration} ago
            </p>
    ` : /*html*/`
            <p>${data.user[j].nickname} ${(data.user[j].nickname != loggedUser) ? data.user[j].follower.some(str => str.includes(loggedUser)) ? addFollowedImg() : addFollowButtons(j) : ''} 
                <img class="seperatorPoint lang" src="svg/tabler--point-filled.svg" alt="Seperator Image"> vor ${postDuration}
            </p>
    `;
}


function getUserPostInfo(j, postDuration) {
    return /*html*/`
        <div class="userPostInfo">
            <div class="avatar">
                <img src="${data.user[j].avatar}" alt="Avatar">
            </div>
            <div class="avatarInfo">
                ${getAvatarInfo(j, postDuration)}
            </div>
        </div>
    `;
}


function getLikeAndCommentButton(j, k) {
    return /*html*/`
        <div class="likeAndCommentButton">
            <input class="likeCheckbox" type="checkbox" id="user${j}_post${k}_like_toggle">
            <img id="user${j}_post${k}_like" class="likeHeart" onclick="setLike('user${j}_post${k}_like', ${j}, ${k})" src="./svg/ph--heart.svg" alt="like">
            <img onclick="showOverlay(${j}, ${k})" src="./svg/noto--left-speech-bubble.svg" alt="comment">
        </div>
    `;
}


function parseContentToHTML(arr, i, j, k) {
    let p1 = (language.getLanguage() == 'english') ? 'Likes' : 'Gefällt';
    let p2 = (language.getLanguage() == 'english') ? 'times' : 'mal';
    let p3 = (language.getLanguage() == 'english') ? 'View all' : 'Alle';
    let p4 = (language.getLanguage() == 'english') ? 'comments' : 'Kommentare ansehen';
    let postDuration = calculateTimestampStringDuration(arr[i].timestamp);
    return /*html*/`
        ${getUserPostInfo(j, postDuration)}
        <img class="postContentImg" src="${arr[i].url}" alt="Image">
        ${getLikeAndCommentButton(j, k)}
        <p class="likeCounter lang">${p1} <b>${arr[i].likes.counter}</b> ${p2}</p>
        <p class="postComment">${data.user[j].posts[k].userComment}</p>
        <p class="commentCounter lang" onclick="showOverlay(${j}, ${k})">${p3} ${data.user[j].posts[k].comments.length} ${p4}</p>
    `;
}


function showOverlay(i, j) {
    let containerId = clearOverlay();
    containerId.innerHTML += getOverlayComments(i, j);
    let postId = document.getElementById('overlayComments');
    showComments(containerId, postId, i, j, false);
}


function getOverlayComments(i, j) {
    return /*html*/`
        <div class="overlayImageContainer">
            <img src="${data.user[i].posts[j].url}" alt="Image">
        </div>
        <div id="overlayCommentContainer" class="overlayCommentContainer">
            <div id="overlayComments" class="overlayComments"></div>
        </div>`;
}


function checkLikes(i, j) {
    if (data.user[i].posts[j].likes.by.find(item => item.nickname === loggedUser)) {
        setFilledHeart(i, j);
    }
    else {
        setUnfilledHeart(i, j)
    }
}


function setLike(id, i, j) {
    if (!data.user[i].posts[j].likes.by.find(item => item.nickname === loggedUser)) {
        setFilledHeart(i, j);
        data.user[i].posts[j].likes.counter += 1;
        data.user[i].posts[j].likes.by.push({ nickname: loggedUser });
    }
    else {
        setUnfilledHeart(i, j);
        if (data.user[i].posts[j].likes.by.find(item => item.nickname === loggedUser)) {
            data.user[i].posts[j].likes.by.splice(data.user[i].posts[j].likes.by.indexOf({ nickname: loggedUser }), 1);
            if (data.user[i].posts[j].likes.counter > 0) data.user[i].posts[j].likes.counter -= 1;
        }
    }

    localStorage.setItem('data', JSON.stringify(data));
    loadInnerContent();
}


function setFilledHeart(i, j) {
    let userId = document.getElementById("user" + i + "_post" + j + "_like");
    let toggleId = "user" + i + "_post" + j + "_like_toggle";
    document.getElementById(toggleId).checked = true;
    userId.setAttribute('src', './svg/ph--heart-fill.svg');
    userId.classList.add('redFilter');
}


function setUnfilledHeart(i, j) {
    let userId = document.getElementById("user" + i + "_post" + j + "_like");
    let toggleId = "user" + i + "_post" + j + "_like_toggle";
    document.getElementById(toggleId).checked = false;
    userId.setAttribute('src', './svg/ph--heart.svg');
    userId.classList.remove('redFilter');
}


function commentField(i, j, k) {
    let p1 = (language.getLanguage() == 'english') ? 'comment' : 'Kommentieren';
    let p2 = (language.getLanguage() == 'english') ? 'post' : 'posten';
    let nickname = data.user[j].nickname;
    return /*html*/`
        <form class="commentForm">
            <textarea class="commentInput" aria-label="Comment" placeholder="${p1}" autocomplete="off" autocorrect="off" name="comment" id="comment_${i}" rows="1"></textarea>
            <button class="postButton" type="button" id="button" onclick="post('${loggedUser}', '${nickname}', ${i}, ${k})">${p2}</button>
        </form>
    `;
}


function post(loggedUser, nickname, commentIndex, postIndex) {
    let comId = document.getElementById('comment_' + commentIndex);
    for (let u = 0; u < data.user.length; u++) {
        if (data.user[u].nickname == nickname) {
            data.user[u].posts[postIndex].comments.push({ nickname: loggedUser, comment: comId.value, timestamp: getTimestampString() });
        }
    }
    comId = '';
    localStorage.setItem('data', JSON.stringify(data));
    loadInnerContent();
}


function getUserId(nickname) {
    let id = 0;
    for (let i = 0; i < data.user.length; i++) {
        id = i;
    }
    return id;
}


function showComments(containerId, postId, i, j, last = true) {
    for (let u = 0; u < data.user[i].posts[j].comments.length; u++) {
        if (last) {
            if (data.user[i].posts[j].comments[u].nickname === loggedUser)
                postId.innerHTML = getComment(i, j, u, last);
        }
        else {
            postId.innerHTML += getComment(i, j, u, last);
        }
    }
    postId.innerHTML += /*html*/`</div>`;
}


function getComment(i, j, u, last = true) {
    let html = /*html*/`
    <div class="comment">
        
        <div class="commentPost">
            <div class="avatar">
                <img class="avatarImg" src="${data.user[findIndex(data, data.user[i].posts[j].comments[u].nickname)].avatar}" alt="Avatar Image">
            </div>
            <p><b>${data.user[i].posts[j].comments[u].nickname}</b> ${data.user[i].posts[j].comments[u].comment}</p>
        </div>`;
    html += (!last) ? getCommentTimestamp(i, j, u) :  /*html*/`</div>`;
    return html;
}


function getCommentTimestamp(i, j, u) {
    return /*html*/`
                <div class="commentPostTimestamp">
                    <p>vor ${calculateTimestampStringDuration(data.user[i].posts[j].comments[u].timestamp)}</p>
                </div>
            </div>
        `;
}


// Load JSON file -> Martin
function loadJSON(file) {
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", file, false);
    xhReq.send(null);
    return JSON.parse(xhReq.responseText);
}


function closeOverlay() {
    document.getElementById('overlay').classList.add('d-none');
    document.querySelector('html').style.setProperty('overflow-y', 'visible');
}


function logOut() {
    localStorage.setItem('LogIn', 'false');
    localStorage.setItem('loggedUser', '');
    hamburger.switchHamburgerActivity();
    document.getElementById('menu-toggle').checked = false;
    document.getElementById('dropdown').classList.add('d-none');
    content(0);
}

window.content = content;
window.post = post;
window.setLike = setLike;
window.showOverlay = showOverlay;
window.closeOverlay = closeOverlay;
window.checkLoginData = checkLoginData;
window.startPage = startPage;
window.logOut = logOut;
window.followerButtonWasClicked = followerButtonWasClicked;
window.forYouButtonWasClicked = forYouButtonWasClicked;
window.followButton = followButton;
window.loadSpecificUserContent = loadSpecificUserContent;
window.profilePage = profilePage;
window.editProfileFollower = editProfileFollower;
window.editProfileFollowed = editProfileFollowed;
window.remove = remove;