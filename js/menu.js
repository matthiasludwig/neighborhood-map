/*
* The menu items are toggled via jquery from here
*/

$('.toggle').on('click', function(){
    mixpanel.track("Sidebar on mobile toggled");
    $('.sidebar').toggleClass('open');
})

$('.toggleOnMenu').on('click', function(){
    $('.sidebar').toggleClass('open');
})

$('.menuButton').on('click', function(){
    mixpanel.track("Menu item opened");
    $(this).next('.collapsable').toggle();
})
