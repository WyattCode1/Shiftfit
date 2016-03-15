function load(page) {
    $.get('/' + page, function (data, res){
        $('#crudHtml').html(data);
    });
}

function modifyItem(page, id) {
    $.get('/' + page + '/' + id, function (data, res){
        $('#crudHtml').html(data);
    });
}

function submit(page, id) {
    clean_error_messages(['name']);
    if (id) {
        var url = '/' + page + '/' + id;
    } else {
        var url = '/' + page;
    }
    $.ajax({
        type: 'POST',
        url: url,
        data: $('#shiftForm').serialize(),
        success: function (data, data2) {
            load(page);
        },
        error: function (data) {
            clean_error_messages(['name']);
            var responseText = JSON.parse(data.responseText);
            show_error_messages(responseText);
        }
    });
}