/* scroll down & up */
$(document).ready(function () {
    // browser window scroll (in pixels) after which the "back to top" link is shown
    var offset = 300;
    // duration of the top scrolling animation (in ms)
    var scrollTopDuration = 700;
    // grab the "back to top" link
    var $backToTop = $('.back-to-top');

    // hide or show the "back to top" link
    $(window).scroll(function () {
        ($(this).scrollTop() > offset) ? $backToTop.addClass('btn-is-visible'): $backToTop.removeClass('btn-is-visible');
    });

    // smooth scroll to top
    $backToTop.on('click', function (event) {
        event.preventDefault();
        $('body, html').animate({
            scrollTop: 0
        }, scrollTopDuration);
    });
});

var OriginTitile = document.title;
var st;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        document.title = "呀，崩溃了 (´O｀)";
        clearTimeout(st);
        console.log('hide');
    } else {
        document.title = '呀，又好了 ｡◕‿◕｡ ';
        console.log('show');
        st = setTimeout(function () {
            document.title = OriginTitile;
        }, 3000);
        console.log('endChange=');
    }
});