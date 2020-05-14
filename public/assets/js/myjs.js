$(document).ready(function () {
    $('.navbar-nav .nav-item').click(function () {
        $('.navbar-nav .nav-item').removeClass('active');
        $(this).addClass('active');
    })
});

$(document).ready(function () {
    $('.nav-pills .nav-link.active').click(function () {
        $('.nav-pills .nav-link.active').removeClass('active');
        $(this).addClass('active');
    })
});



// $(document).ready(function() {
//     // -----------------------------------------------------------------------
//     $.each($('#navbar').find('li'), function() {
//         $(this).toggleClass('active', 
//             window.location.pathname.indexOf($(this).find('a').attr('href')) > -1);
//     }); 
//     // -----------------------------------------------------------------------
// });

// $(document).ready(function() {
//     // -----------------------------------------------------------------------
//     $.each($('nav').find('.nav-item'), function() {
//         $(this).toggleClass('active', 
//             window.location.pathname.indexOf($(this).find('a').attr('href')) > -1);
//     }); 
//     // -----------------------------------------------------------------------
// });