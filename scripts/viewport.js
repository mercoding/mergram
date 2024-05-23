if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent) && window.addEventListener && document.querySelector) {
    window.addEventListener('orientationchange', rotateWithNoScale, false);
}


function rotateWithNoScale() {
    let viewport = document.querySelector("meta[name=viewport");
    if (viewport) {
        let content = viewport.getAttribute("content");
        viewport.setAttribute("content", content + ", maximum-scale=1.0");
        setTimeout(function () { viewport.setAttribute("content", content); }, 90);
    }
}
