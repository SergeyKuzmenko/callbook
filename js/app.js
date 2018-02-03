$(document).ready(function() {
    get_config(); // load configurations
    if (window.location.hash) {
        toClient = decodeURIComponent((window.location.hash).slice(1)).replace(/_/ig, ' ');
        $('.search_text').val(toClient);
        search(toClient);
    }
});

$('form').submit(function() {
    return false;
});

$(function() {
    $('.search_text').keydown(function(e) {
        if (e.keyCode === 13) {
            var query = $('.search_text').val();
            search(query);
        }
    });
    $('.search_button').click(function() {
        var query = $('.search_text').val();
        search(query);
    });
    $('.search_text').bind("input", function() {
        var query = $('.search_text').val();
        search(query);
    });
})

function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    if (arr[i] !== undefined) rv[i] = arr[i];
  return rv;
}

function search(query) {
    location.hash = '#' + query.replace(/ /ig, '_'); //create hash
    if ($.isNumeric(query)) {
        type = 'integer'
    }else {
        type = 'string'
    }
    if (query.length >= 2) {
        $.ajax({
            type: 'post',
            url: "/api/search",
            dataType: "json",
            data: {
                'q': query,
                'type': type
            },
            beforeSend: function() {
                $('#result').css('opacity', '0.5');
                close_window();
            },
            success: function(data) {
                if (data.count != 0) {
                    rednerMainTemplate(data);
                    $('#result').css('opacity', '1');
                    $("#result").highlight(query);
                }
                if (data.count == 0) {
                    rednerNotFoundTemplate();
                    $('.error_show').text('Ничего не найдено');
                    $('#result').css('opacity', '1');
                }
            }
        })
    } else {
        rednerNotFoundTemplate();
        $('.error_show').text('Введите не менее двух символов');
        $('#result').css('opacity', '1');
    }
}

function rednerMainTemplate(data) {
    var template = $('#MainTemplate').html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, data);
    $('#result').html(rendered);
    $('#result').css('display', '');
}

function rednerNotFoundTemplate() {
    var template = $('#NotFoundTemplate').html();
    Mustache.parse(template);
    var rendered = Mustache.render(template);
    $('#result').html(rendered);
    $('#result').css('display', '');
}

function get_config() {
    $.ajax({
        type: 'get',
        url: "/api/get_config",
        dataType: "json",
        success: function(data) {
            $("#count_contacts").text(data.count);
            $("title").text(data.title);
        }
    })
}

$(function($) {
    $("#phone").mask("+38(999)99-99-999");
});

$("form").on("submit", function(event) {
    event.preventDefault();
    var data = $(this).serialize();
    $.ajax({
        type: 'POST',
        url: "../api/add",
        data: data,
        dataType: "json",
        beforeSend: function() {
            $('#add_contact').css('opacity', '0.5');
        },
        success: function(data) {
            if (data.status == 0) {
                $("#Send_Form").notify("Внутренняя ошибка", "error");
                $("#url_vk").notify("Проверьте правильность ссылки", "warn");
            }
            if (data.status == 1) {
                $("#phone").notify("Номер уже есть в базе", "warn");
            }
            if (data.status == 2) {
                $("#phone").notify("Успешно добавлен", "success");
            }
            $('#add_contact').css('opacity', '1');
        },
        error: function(data) {
            $('#add_contact').css('opacity', '1');
        }
    })
});

$('.add_contact_button').click(function() {
    close_window();
    $('#add_contact').css('display', '');
    $('#result').css('display', 'none');
});

$('.export_button').click(function() {
    close_window();
    $('#export_contact').css('display', '');
    $('#result').css('display', 'none');
});

$('.informations_button').click(function() {
    close_window();
    $('#informations').css('display', '');
    $('#result').css('display', 'none');
});

function close_window() {
    $('#export_contact').css('display', 'none');
    $('#add_contact').css('display', 'none');
    $('#informations').css('display', 'none');
    $('#result').css('display', '');
}