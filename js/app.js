$(document).ready(function() {
    get_config(); // update count contacts
    if (window.location.hash) {
        $('.search_text').val((window.location.hash).slice(1));
        search((window.location.hash).slice(1));
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

function search(query) {
    location.hash = '#' + query; //create hash
    if (query.length >= 2) {
        $.ajax({
            type: 'post',
            url: "/api/search",
            dataType: "json",
            data: {
                'q': query
            },
            beforeSend: function() {
                $('#result').css('opacity', '0.5');
            },
            success: function(data) {
                if (data.count != 0) {
                    count = Object.keys(data.response).length;
                    $('.count_items').html(count);
                    rednerMainTemplate(data);
                    $('#result').css('opacity', '1');
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
$(function() {
    $('.add_contact_button').click(function() {
        $('#add_contact').css('display', '');
        $('#custom-search-input').css('display', 'none');
        $('#result').css('display', 'none');
        $('#contact-list').css('display', 'none');
        $('#export_contact').css('display', 'none');
    });
})
$(function() {
    $('.close_button').click(function() {
        $('#add_contact').css('display', 'none');
        $('#informations').css('display', 'none');
        $('#result').css('display', 'none');
    });
})
