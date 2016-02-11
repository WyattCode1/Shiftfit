var request = require('request');

function _get_related_areas(area, callback) {
    console.debug("Loading related areas");
    area = area ? area : 'Business+And+Technical';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var request_url = global.config.app_url + '/backend-rest/areas_search?expertArea=' + area;
    request_url = request_url.indexOf("http") > -1 ? request_url : 'http:' + request_url;
    console.debug('Making request to : ' + request_url);
    request(request_url, function(error, response, body) {
        if(error) {
            console.error("Cant retrieve related areas", error);
            return callback({});
        }
        try {
            body = JSON.parse(body);
            return callback(body.relatedAreas, body.metaTitle, body.metaDescription, body.dynamiclySampleInqs);
        } catch (e) {
            console.info('Problem retrieving areas');
            return callback({});
        }
    });
}

module.exports = function () {
    return {
        get_related_areas : _get_related_areas
    }
};