var SET_COOKIE_STR = "Set-Cookie: ";
var EQUAL_SEPARATOR = "=";
var SEMICOLON_SEPARATOR = "; ";
var END_LINE = "\r\n";
var SPACE_SEPARATOR = ' ';
var COLON_SEPARATOR = ': ';

var BODY_TYPE_STR = "Content-Type";
var BODY_LENGTH_STR = "Content-Length";

/**
 * will hold the full mimetypes for each file type.
 * @type {{js: string, txt: string, html: string, css: string, jpg: string, gif: string, png: string, json: string}}
 */
var mimetypes = {
    'js': 'application/javascript; charset=utf-8;',
    'txt': 'text/plain; charset=utf-8;',
    'html': 'text/html; charset=utf-8;',
    'css': 'text/css; charset=utf-8;',
    'jpg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png',
    'json': 'application/json',
};

/**
 * will hold the status messages for each return code
 * @type {{200: string, 302: string, 403: string, 404: string, 500: string}}
 */
var statusMessages = {
    200: ' OK',
    302: ' Found',
    403: ' Forbidden',
    404: ' Not Found',
    500: ' Internal Server Error'
}

/**
 * a Cookie class to represent each cookie
 * @param name - the cookie's name
 * @param value - the cookie's value
 * @param options - optional options for the cookie
 * @constructor will create the cookkie instance.
 */
function Cookie(name, value, options){
    var that = this;

    this.name = name;
    this.value = value;
    this.options = options;

    this.toString = function()
    {
        var cookieString = SET_COOKIE_STR + that.name + EQUAL_SEPARATOR + that.value;

        for(var option in that.options){
            if(that.options.hasOwnProperty(option)){
                cookieString += SEMICOLON_SEPARATOR + option;

                if(that.options[option] !== null){
                    cookieString += EQUAL_SEPARATOR + that.options[option];
                }

                else{
                    cookieString += "";
                }
            }
        }

        cookieString += END_LINE;
        return cookieString;
    }
}

/**
 * the main module response class, which actually represents a generic server response.
 * @param version - the protocol version in use, e.g HTTP/1.0
 * @param conn - the connection object used to stream the data
 */
module.exports = function(version, conn) {
    var that = this;

    var version = version;
    var conn = conn;

    var headers = {};
    var cookies = [];
    var statusCode = "200";
    headers[BODY_TYPE_STR] = mimetypes['html'];
    var sent = false;

    /**
     * search for a matching object key to prop, Case Insensitive.
     * @param object
     * @param prop - the specific prop searched in object
     * @returns {Array.<T>} - all the matching keys
     * @constructor
     */
    var CIgetProperty = function(object, prop){
        var objectKeys = Object.keys(object);
        return objectKeys.filter(function (oProp) {
            return oProp.toLowerCase() === prop.toLowerCase();
        });
    };

    /**
     * a toString function for the response headers including cookies.
     * @returns {string} - a string representing the response without it's body.
     */
    var getHeaderStr = function(){
        var responseString = "";
        responseString += version.concat(SPACE_SEPARATOR, statusCode, statusMessages[statusCode], END_LINE);
        responseString += BODY_TYPE_STR.concat(COLON_SEPARATOR, headers[BODY_TYPE_STR], END_LINE);
        responseString += BODY_LENGTH_STR.concat(COLON_SEPARATOR, headers[BODY_LENGTH_STR], END_LINE);

        for(var header in headers){
            if((header !== BODY_TYPE_STR) && (header !== BODY_LENGTH_STR)){
                if(headers.hasOwnProperty(header)){
                    responseString += header.concat(COLON_SEPARATOR, headers[header], END_LINE);
                }
            }
        }

        for(var cookie in cookies){
            if(cookies.hasOwnProperty(cookie)){
                responseString += cookies[cookie].toString();
            }
        }

        responseString += END_LINE;
        return responseString;
    };

    /**
     * a setter for an header
     * @param field - the header to set
     * @param value - the value to give the header
     */
    this.set = function(field, value){

        var argsObj;

        if(arguments.length === 1){

            argsObj = arguments[0];

            for(var tempNewHeader in argsObj)
            {
                if(argsObj.hasOwnProperty(tempNewHeader)){
                    headers[tempNewHeader] = argsObj[tempNewHeader];
                }

            }
        }

        else{
            headers[field] = value;
        }
    };

    /**
     * set the response status code
     * @param code - the code to change to
     * @returns {module} - the obj
     */
    this.status = function(code){
        statusCode = code;
        return that;
    };

    /**
     * a getter for a specific header
     * @param field - the header to get
     * @returns {*} - either the value of the requested header, or undefined if not found.
     */
    this.get = function(field){
        var tempKeys = CIgetProperty(headers, field);

        //no CI match
        if(tempKeys.length <= 0){
            return undefined;
        }

        //if there's a match, return the first matching key value
        return headers[tempKeys[0]];

    };

    /**
     * set a cookie for the response
     * @param name - the cookie name
     * @param value - the cookie value
     */
    this.cookie = function(name, value) {
        var cookieOptions = null;
        if(arguments.length == 3){
            cookieOptions = arguments[2];
        }

        cookies.push(new Cookie(name, value, cookieOptions));
    };

    /**
     * send this response to the connection conn
     * @param body - the response's body, in a string format.
     */
    this.send = function(body){
        sent = true;
        if (body === undefined || body === null) {
            body = '';
        }

        if (body instanceof Buffer) {
        } else if (typeof body === 'object') {
            that.json(body);
            return;
        } else if (typeof body === 'number') {
            body = body.toString();
        }

        headers[BODY_LENGTH_STR] = body.length;
        conn.write(getHeaderStr());
        conn.write(body);
    };

    /**
     * send this response to the connection conn
     * @param body - the response's body, in a json format.
     */
    this.json = function(body){
        headers[BODY_TYPE_STR] = mimetypes['json'];
        that.send(JSON.stringify(body));
    };

    /**
     * a setter for the body content type
     * @param type - the content type
     */
    this.type = function(type){
        headers[BODY_TYPE_STR] = mimetypes[type];
    };

    /**
     * a resetter for the response obj. resets all relevant values.
     * @returns {module} - the obj.
     */
    this.reset = function(){
        headers = {};
        cookies = {};
        statusCode = "200";
        headers[BODY_TYPE_STR] = mimetypes['html'];
        return that;
    };

    /**
     * returns the flag sent indicating whether this response was sent.
     * @returns {boolean} - true iff the response was sent.
     */
    this.wasSent = function(){
        return sent;
    };

};
