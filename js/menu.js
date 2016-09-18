/*
* The menu items are toggled via jquery from here
*/

$('#toggle').on('click', function(){
    $('.sidebar').toggleClass('open');
})

$('.menuButton').on('click', function(){
    $(this).next('.collapsable').toggle();
})
