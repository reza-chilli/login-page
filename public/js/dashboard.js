$(document).ready(function() {
    $('#logoutBtn').on('click', function() {
        $.ajax({
            url: "/dashboard/logout",
            method : 'GET',
            success : function() {
                window.location.href = '/auth/register'
            } 
        })
    })
})