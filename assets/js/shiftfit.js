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
    $.ajax({
        type: 'POST',
        url: url,
        data: $('#crudForm').serialize(),
        success: function (data, data2) {
            load(page);
        },
        error: function (data) {
            clean_error_messages();
            var responseText = JSON.parse(data.responseText);
            show_error_messages(responseText);
        }
    });
}