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
}

$.ajaxSetup({complete: onRequestCompleted});

function onRequestCompleted(xhr, textStatus) {
	if (xhr.status == 302) {
		location.href = xhr.getResponseHeader("Location");
	}
}

function load(page) {
	$.get('/' + page, function (data, res) {
		$('#crudHtml').html(data);
	});
}

function loadById(page, id) {
	$.get('/' + page + '?search_id=' + id, function (data, res) {
		$('#crudHtml').html(data);
	});
}

function find(page, callback) {
	var searchTerm = $('#search_term').val();
	$.get('/' + page + '?search_term=' + searchTerm, function (data, res){
		$('#crudHtml').html(data);
		$('#search_term').val(searchTerm);
		if (callback) {
			return callback();
		}
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
	$.get('/' + page + '/' + id, function (data, res) {
		$('#crudHtml').html(data);
	});
}

function modifyItemByBox(page, id, box_id) {
	 $.get('/' + page + '/' + id + '?box=' + box_id, function (data, res) {
		$('#crudHtml').html(data);
	});
}

function submitByBoxPage(page, boxId, id) {
	clean_error_messages();
	if (id) {
		var url = '/' + page + '/' + id;
	} else {
		var url = '/' + page;
	}
	submitUrl(url, 'crudForm', function () {
		page = page + '/' + id + '?box=' + boxId;
		load(page);
	});
}

function deleteItemByBox(page, id, box_id) {
	$.ajax({
		url: '/' + page + '/' + id + '?box=' + box_id,
		type: 'DELETE',
		success: function (data) {
			page = page + '/' + id + '?box=' + box_id;
			load(page);
		},
		error: function (data) {
			clean_error_messages();
			var responseText = JSON.parse(data.responseText);
			show_error_messages(responseText);
		}
	});
}

function submitForm(page, id) {
	clean_error_messages();
	if (id) {
		var url = '/' + page + '/' + id;
	} else {
		var url = '/' + page;
	}
	submitUrl(url, 'crudForm', function () {
		load(page);
	});
}

function submitUrl(url, formId, sucessCallback) {
	var dataS =  $('#' + formId).serialize();
	$.ajax({
		type: 'POST',
		async : false,
		url: url,
		data: dataS,
		success: sucessCallback,
		error: function (data) {
			clean_error_messages();
			var responseText = JSON.parse(data.responseText);
			show_error_messages(responseText);
		}
	});
}

function make_autocomplete(fieldId, url, labelName, onselect) {
	console.log('Making autocomplete');
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

function clear_fields(page) {
	$('.clear_field').each(function(elem) {
		$(this).val('');
	});
}

var Cookies = {
	get_cookie : function get_cookie(name) {
		var value = "; " + document.cookie;
		var parts = value.split("; " + name + "=");
		if (parts.length == 2) return parts.pop().split(";").shift();
	},
	delete_cookie : function delete_cookie( name ) {
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	},
	create_cookie : function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}
};