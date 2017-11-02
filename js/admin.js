$(document).ready(function() {
    query('last_added');
    jQuery(function($){
        $('.table').footable({
            "paging": {
                "enabled": true
            },
            "filtering": {
                "enabled": true
            },
            "sorting": {
                "enabled": true
            },
            "columns": $.get("../admin/getColumns/" + getAccessToken()),
            "rows": $.get("../admin/getRows/" + getAccessToken())
        });
    });
});

$('.button_logout').click(function() {
    setCookie('access_token', 0, 1);
    location.reload();
    return false;
});

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function query(method) {
    $.ajax({
        type: 'get',
        url: "/admin/" + method + "/" + getAccessToken(),
        beforeSend: function() {
            $('#listLastAdded').html('<img src="../image/load.gif">');
        },
        success: function(data) {
            getLastAdded(data);
        }
    })
}

function getAccessToken() {
    return getCookie('access_token');
}

function getLastAdded(data) {
    var template = $('#lastAdded').html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, data);
    $('#listLastAdded').html(rendered);
}