$('#toggle').on('click', function(){
    $('.sidebar').toggleClass('open');
})

$('.menuButton').on('click', function(){
    $(this).next('.collapsable').toggle();
})

$('#submitButton').on('click', function(){
    for (var i = 1; i <= 10; i++) {
        var cbox = "#cbox" + i.toString();
        console.log($(cbox).val() + ($(cbox).is(':checked')));
    }
})
