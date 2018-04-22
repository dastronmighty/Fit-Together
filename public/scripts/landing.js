var windowHeight = $(window).height();
$('.bg').css("height", windowHeight);

var imgs = ["/images/jogging.jpg", "/images/dance.jpg", "/images/runners.jpeg", "/images/surfer.jpg", "/images/soccer.jpg"];

var chosenImg = parseInt((Math.random() * 5));

var bgHieght = $('.bg').css("height");

$('.bg').css("background-image", "url("+imgs[chosenImg]+")");

var captionplacement = parseInt(bgHieght)/2;
$('.caption').css("top", captionplacement);
