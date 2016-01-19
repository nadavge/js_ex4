var HTTP_PROTOCOL = "http";
var TYPE_STR = "Content-Type";
var SLASH_SEPARATOR = '/';

function pathIncluded(checkedPath, includingPath) {
    var splitChecked = checkedPath.split(SLASH_SEPARATOR);
    var splitIncluding = includingPath.split(SLASH_SEPARATOR);

    for (var i = 0; i < splitChecked.length; i++) {
        if ((splitChecked[i] !== splitIncluding[i]) && (splitIncluding[i] !== '*'))
            return false;
    }

    if ((splitChecked.length !== splitIncluding.length) && (splitIncluding[i - 1] !== '*'))
        return false;

    return true;

}

module.exports = function (headers, query, method, cookies, path, host, protocol, body) {

    this.query = query;
    this.method = method;
    this.cookies = cookies;
    this.path = path;
    this.host = host;

    var headers = headers;
    var urlParams = {};

    if (protocol !== null) {
        this.protocol = protocol;
    }

    else {
        this.protocol = HTTP_PROTOCOL;
    }

    this.body = body;

    
    this.get = function (field) {
        if (headers.hasOwnProperty(field)) {
            return headers[field];
        }
        return undefined;
    };

    this.param = function (name) {

        if(urlParams.hasOwnProperty(name))
            return urlParams[name];
        if(query.hasOwnProperty(name))
            return query[name];

        return undefined;
    };

    this.is = function (type) {
        var contentType = this.get(TYPE_STR);

        if (type === contentType)
            return true;

        var splitType = type.split(SLASH_SEPARATOR);

        if (type === splitType[splitType.length - 1])
            return true;

        if (pathIncluded(contentType, type))
            return true;

        return false;
    };

    this.setUrlParams = function (urlParamsArg) {
        urlParams = urlParamsArg;
    };
};
