//Обновляем счетчик количества конактов в базе даных
$(document).ready(update_count_contact());

//Загружаем шаблоны
$(document).ready(function(){
	$.get('../template/templates.html', function(data){
		$('.templates').html(data);
	});
});

//Запрет отправки формы после нажатии кнопки "Submit"
$('form').submit(function() {
	return false;
});

// Поиск
$(function() {
	$('.search_text').keydown(function(e) {
		if(e.keyCode === 13) {
			var query = $('.search_text').val();
			search(query);
			load_photo();
		}
	});
	
	$('.search_button').click(function(){
		var query = $('.search_text').val();
		search(query);
		load_photo();
	});

	$('.search_text').bind("input", function() {
        var query = $('.search_text').val();
		search(query);
		load_photo();
    });
})

function search(query) {
	if (query.length >= 2) {
		$.ajax({
			type: 'post',
			url: "/api/search",
			data: {'q':query},
			beforeSend: function() {
				$('#result').css('opacity', '0.5');
			},
			success: function(data) {
				if (data.count != 0) {
					rednerMainTemplate(data);
					$('#result').css('opacity', '1');
				}
				if(data.count == 0){
					rednerNotFoundTemplate();
					$('.error_show').text('Ничего не найдено');
					$('#result').css('opacity', '1');
				}
			}
		})
	}else{
		rednerNotFoundTemplate();
		$('.error_show').text('Введите не менее двух символов');
		$('#result').css('opacity', '1');
	}
}

function rednerMainTemplate(data){
	var template = $('#MainTemplate').html();
	Mustache.parse(template);  
  	var rendered = Mustache.render(template, data);
  	$('#result').html(rendered);
  	$('#result').css('display', '');
}

function rednerNotFoundTemplate(){
	var template = $('#NotFoundTemplate').html();
	Mustache.parse(template);  
  	var rendered = Mustache.render(template);
  	$('#result').html(rendered);
  	$('#result').css('display', '');
}

function rednerAddNewNumberTemplate(data){
	var template = $('#AddNewNumberTemplate').html();
	Mustache.parse(template);  
  	var rendered = Mustache.render(template, data);
  	$('#result').html(rendered);
  	$('#result').css('display', '');
}

function rednerAddNewNumberErrorTemplate(){
	var template = $('#AddNewNumberErrorTemplate').html();
	Mustache.parse(template);  
  	var rendered = Mustache.render(template);
  	$('#result').html(rendered);
  	$('#result').css('display', '');
}

// Обновление щетчика количества контактов
function update_count_contact() {
	$.ajax({
		type: 'get',
		url: "/api/count_contacts",
		success: function(data) {
			$("#count_contacts").text(data.count).fadeIn();
		}
	})
}

$(function($){
   $("#phone").mask("+38(999)99-99-999");
});

//Add new contact
$("form").on( "submit", function(event) {
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
        		rednerAddNewNumberErrorTemplate();
           		console.log('Internal Error');
           	}
           	if(data.status == 1){
           		rednerNotFoundTemplate();
				$('.error_show').text('Номер найден в базе');
           		console.log('Number Found');
           	}
           	if(data.status == 2){
				console.log('OK!');
           	}

           	$('#add_contact').css('opacity', '1');
        },
        error: function(data) {
            $('#add_contact').css('opacity', '1');
        }
    })
 
});
 
$(function(){
    $('#add_contact_button').click(function(){
        $('#add_contact').css('display', '');
        $('#custom-search-input').css('display', 'none');
        $('#result').css('display', 'none');
        $('#contact-list').css('display', 'none');
        $('#export_contact').css('display', 'none');
    });
})
 
$(function(){
    $('.close_form').click(function(){
        $('#add_contact').css('display', 'none');
        $('#custom-search-input').css('display', '');
        $('#result').css('display', '');
        $('#contact-list').css('display', '');
    });
})
 
$(function(){
    $('#export_button').click(function(){
        $('#export_contact').css('display', '');
        $('#add_contact').css('display', 'none');
        $('#custom-search-input').css('display', 'none');
        $('#result').css('display', 'none');
        $('#contact-list').css('display', 'none');
    });
})
 
$(function(){
    $('.close_export').click(function(){
        $('#export_contact').css('display', 'none');
        $('#custom-search-input').css('display', '');
        $('#result').css('display', '');
        $('#contact-list').css('display', '');
    });
})

VK.init({
    apiId: 4746140
});

function load_photo() {
    id = {};
    $('.vk_id').each(function(e, i) {
        id[e] = $(this).val();
    });
    id = objToString (id);
	id = id.slice(0,-1);
    GetPhotoById(id);
}

function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += obj[p] + ',';
        }
    }
    return str;
}

function GetPhotoById(id){
    VK.Api.call('users.get', {user_ids: id, fields: 'photo_100'}, function(r) {
          if(r.response) {
			for (var key in r.response) {
				RefreshPhoto(r.response[key].uid, r.response[key].photo_100);
				console.log(r.response[key].uid +': '+ r.response[key].photo_100);
			}
        }else{
            console.log('Error: '+r.error.error_msg);
        }
    });
}

function RefreshPhoto(id, imgUrl) {
	$('.id_'+id).attr('src', imgUrl +'?'+ Math.random());
}

