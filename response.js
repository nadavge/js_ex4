var SET_COOKIE_STR = "Set-Cookie: ";
var EQUAL_SEPARATOR = "=";
var SEMICOLOMN_SEPARATOR = "; ";
var END_LINE = "\r\n";
var SPACE_SEPARATOR = ' ';
var COLON_SEPARATOR = ':';

var BODY_TYPE_STR = "Content-Type";
var BODY_LENGTH_STR = "Content-Length";

var httpVersion = "HTTP/1.1";

var mimetypes = {
    'js': 'application/javascript; charset=utf-8;',
    'txt': 'text/plain; charset=utf-8;',
    'html': 'text/html; charset=utf-8;',
    'css': 'text/css; charset=utf-8;',
    'jpg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png',
    'json': 'application/json'
};

function cookie(name, value, options){
    this.name = name;
    this.value = value;
    this.options = options;

    this.toString = function()
    {
        var cookieString = SET_COOKIE_STR + this.name + EQUAL_SEPARATOR + this.value;

        for(var option in this.options){
            if(this.options.hasOwnProperty(option)){
                cookieString += SEMICOLOMN_SEPARATOR + option;

                if(this.options[option] !== null){
                    cookieString += EQUAL_SEPARATOR + this.options[option];
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

//module.exports.compose = function(version, statusCode, bodyType, bodyLength) {
//    var response = '';
//    // add the first response header to the stream
//    response += version.concat(SPACE_SEPARATOR, statusCode, LINE_SEPARATOR);
//
//    //build both headers that describe the response body
//    response += BODY_TYPE_STR.concat(COLON_SEPARATOR, bodyType, LINE_SEPARATOR);
//    response += BODY_LENGTH_STR.concat(COLON_SEPARATOR, bodyLength, LINE_SEPARATOR);
//    //writing the body content to the stream
//    response += LINE_SEPARATOR;
//
//    return response;
//}

module.exports = function(headers) {

    var headers = headers;
    var statusCode = "200";
    var cookies = {};

    /*
    set(field, value)
    status(code)
    get(field)
    cookie(name, value, [options])
    send(body)
    json(body)
    */

    //search for a matching object key to prop, Case Insensitive.
    var CIgetProperty = function(object, prop){
        var objectKeys = Object.keys(object);
        var objectRelevantKeys = objectKeys.filter(function (oProp) {
            return oProp.toLowerCase() === prop.toLowerCase();
        });

        return objectRelevantKeys;
    };

    var getHeaderStr = function(){
        var responseString = "";
        responseString += httpVersion.concat(SPACE_SEPARATOR, statusCode, END_LINE);

        for(var header in headers){
            if(headers.hasOwnProperty(header)){
                responseString += header.concat(COLON_SEPARATOR, headers[header], END_LINE);
            }
        }

        responseString += END_LINE;
        return responseString;
    }

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

    //easy to implement. we should just decide where the response header will be made
    this.status = function(code){
        statusCode = code;
    };

    this.get = function(field){
        var tempKeys = CIgetProperty(headers, field);

        //no CI match
        if(tempKeys.length <= 0){
            return undefined;
        }

        //if there's a match, return the first matching key value
        return headers[tempKeys[0]];

    };

    //should have options optionally
    this.cookie = function(name, value) {
        var cookieOptions = null;
        if(arguments.length == 3){
            cookieOptions = arguments[2];
        }

        cookies.push(new cookie(name, value, cookieOptions));
    };

    this.send = function(body){
        headers[BODY_LENGTH_STR] = body.length;

    };

    this.json = function(body){

    };

    this.type = function(type){
        headers[BODY_TYPE_STR] = mimetypes[type];
    }


}
