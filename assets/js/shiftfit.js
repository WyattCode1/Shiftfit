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