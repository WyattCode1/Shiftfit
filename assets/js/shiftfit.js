function show_error_messages(errors) {
    var msg = '';
    var count = 0;
    console.info('ERRORS: ' + JSON.stringify(errors));
    $.each(errors, function (index, error) {
        $("#"+error.param).addClass("required");
        count = count+1;
        msg = msg + error.msg;
        if ((count < errors.length) && (error.msg.length > 0)) {
            msg = msg + ' - ';
        } else {
            $("#"+error.type+"-error-label").html(msg);
            $("#"+error.type+"-error-div").show();
        }
    });
    $('html, body').animate({scrollTop: 0}, 'fast');
}

function clean_error_messages(fields) {
	if (fields) {
        $.each(fields, function (index, field) {
            $('#'+field).removeClass('required');
        });
	}
    $('#general-error-div').hide();
    $("input, textarea").each(function(){
		$(this).val(jQuery.trim($(this).val()));
	});
}

$.ajaxSetup({complete: onRequestCompleted});

function onRequestCompleted(xhr,textStatus) {
    if (xhr.status == 302) {
        location.href = xhr.getResponseHeader("Location");
    }
}

function load(page) {
    $.get('/' + page, function (data, res){
        $('#crudHtml').html(data);
    });
}

function deleteItem(page, id) {
	$.ajax({
		url: '/' + page + '/' + id,
		type: 'DELETE',
		success: function (data) {
        	load(page);
    	},
        error: function (data) {
            clean_error_messages();
            var responseText = JSON.parse(data.responseText);
            show_error_messages(responseText);
        }
    });
}

function modifyItem(page, id) {
    $.get('/' + page + '/' + id, function (data, res){
        $('#crudHtml').html(data);
    });
}

function submit(page, id) {
    clean_error_messages();
    if (id) {
        var url = '/' + page + '/' + id;
    } else {
        var url = '/' + page;
    }
    submitUrl(url, 'crudForm', function (){
        load(page);
    });
}

function submitUrl(url, formId, sucessCallback) {
    $.ajax({
        type: 'POST',
        url: url,
        data: $('#' + formId).serialize(),
        success: sucessCallback,
        error: function (data) {
            clean_error_messages();
            var responseText = JSON.parse(data.responseText);
            show_error_messages(responseText);
        }
    });
}

function make_autocomplete(fieldId, url, labelName, onselect) {
	$("#" + fieldId).autocomplete({
		source: function(request, response) {
			$.get(url + '/' + request.term, function(data) {
				var arrayLength = data.length;
				var names = [];
				for (var i = 0; i < arrayLength; i++) {
					names.push(data[i][labelName]);
				}
				response(names);
			});
		},
		select: function(event, ui) {
			var user = ui.item.value;
			return onselect(user, true);
		},
		minLength: 2
	});
	$("#" + fieldId).keypress(function (event) {
		if ( event.which == 13 ) {
			var user = $('#' + fieldId).val();
			return onselect(user, true);
		}
	});
}