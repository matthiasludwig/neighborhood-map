$('#toggle').on('click', function(){
    $('.sidebar').toggleClass('open');
})

$('.menuButton').on('click', function(){
    $(this).next('.collapsable').toggle();
})

$('#submitButton').on('click', function(){

})
