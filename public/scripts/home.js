var navHeight = $('.container-fluid').css("height");

var h1Height = $('#clubmap').css("height");

var windowHeight = $(window).height();

var map = $('#map');

var height = windowHeight - ( parseInt(navHeight)+parseInt(h1Height) ) - 40;

map.css("height", height);
