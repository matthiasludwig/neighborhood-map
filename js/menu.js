$('#toggle').on('click', function(){
    $('.sidebar').toggleClass('open');
})

$('.menuButton').on('click', function(){
    console.log("A menu item was clicked!");
    $(this).next('.collapsable').toggle();
})

$('#submitButton').on('click', function(){
    console.log("The Submit Button has been clicked");
})
