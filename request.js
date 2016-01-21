var HTTP_PROTOCOL = "http";
var BODY_TYPE_STR = "Content-Type";
var SLASH_SEPARATOR = '/';

/**
 * a helper function used to decide if one path is included in the other
 * @param checkedPath - the smaller path.
 * @param includingPath - the more general, including path.
 * @returns {boolean} - true iff checkedPath<=includingPath
 */
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

/**
 * the main module response class, which actually represents a generic server request.
 * @param headers - the headers for the request
 * @param query - the query params parsed, for the request.
 * @param method - the request method (e.g GET)
 * @param cookies - an object with all the cookies received in the request
 * @param path - the requested path
 * @param host - the requested host
 * @param version - the protocol version used for the request
 * @param protocol - the protocol used for the request
 * @param body - the requeset body.
 */
module.exports = function (headers, query, method, cookies, path, host, version, protocol, body) {

    var that = this;

    this.query = query;
    this.method = method;
    this.cookies = cookies;
    this.path = path;
    this.host = host;
    this.version = version;

    var headers = headers;
    var urlParams = {};

    if (protocol !== null) {
        this.protocol = protocol;
    }

    else {
        this.protocol = HTTP_PROTOCOL;
    }

    this.body = body;

    /**
     * checks whether after serving the request, the connection should be closed.
     * @returns {boolean} - true iff should be closed.
     */
    this.shouldClose = function(){
        if ((headers['Connection'] !== 'keep-alive' &&
            version === 'HTTP/1.0') ||
            headers['Connection'] === 'close'){
            return true;
        }
        return false;
    };

    /**
     * a getter for the header values.
     * @param field - the header requested
     * @returns {*} - the header value if present, undefined o.w.
     */
    this.get = function (field) {
        if (headers.hasOwnProperty(field)) {
            return headers[field];
        }
        return undefined;
    };

    /**
     * returns the request param if exists. searches both the query and the url.
     * @param name - the requested param name.
     * @returns {*} - the param value if present, or undefined o.w.
     */
    this.param = function (name) {
        if(urlParams.hasOwnProperty(name))
            return urlParams[name];
        if(query.hasOwnProperty(name))
            return query[name];

        return undefined;
    };

    /**
     * returns true iff the body content type in type.
     * @param type - the body content type.
     * @returns {boolean} - true iff the body content type in type.
     */
    this.is = function (type) {
        var contentType = that.get(BODY_TYPE_STR);

        if (type === contentType) {
            return true;
        }

        var splitType = contentType.split(SLASH_SEPARATOR);

        if (type === splitType[splitType.length - 1]) {
            return true;
        }

        if (pathIncluded(contentType, type)){
            return true;
        }


        return false;
    };

    /**
     * a setter for the url params object.
     * @param urlParamsArg - the url params.
     */
    this.setUrlParams = function (urlParamsArg) {
        urlParams = urlParamsArg;
    };
};
