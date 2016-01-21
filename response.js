var SET_COOKIE_STR = "Set-Cookie: ";
var EQUAL_SEPARATOR = "=";
var SEMICOLON_SEPARATOR = "; ";
var END_LINE = "\r\n";
var SPACE_SEPARATOR = ' ';
var COLON_SEPARATOR = ':';

var BODY_TYPE_STR = "Content-Type";
var BODY_LENGTH_STR = "Content-Length";

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

module.exports = function(version, conn) {
    var that = this;

    var version = version;
    var conn = conn;

    var headers = {};
    var cookies = {};
    var statusCode = "200";
    headers[BODY_TYPE_STR] = mimetypes['html'];
    var sent = false;

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
        responseString += version.concat(SPACE_SEPARATOR, statusCode, END_LINE);
        responseString += BODY_TYPE_STR.concat(COLON_SEPARATOR, headers[BODY_TYPE_STR], END_LINE);
        responseString += BODY_LENGTH_STR.concat(COLON_SEPARATOR, headers[BODY_LENGTH_STR], END_LINE);

        for(var header in headers){
            if((header !== BODY_TYPE_STR) && (header !== BODY_LENGTH_STR)){
                if(headers.hasOwnProperty(header)){
                    responseString += header.concat(COLON_SEPARATOR, headers[header], END_LINE);
                }
            }
        }

        responseString += END_LINE;
        return responseString;
    };

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
        return that;
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

    this.cookie = function(name, value) {
        var cookieOptions = null;
        if(arguments.length == 3){
            cookieOptions = arguments[2];
        }

        cookies.push(new Cookie(name, value, cookieOptions));
    };

    this.send = function(body){
        sent = true;
        headers[BODY_LENGTH_STR] = body.length;
        conn.write(getHeaderStr());
        conn.write(body);
    };

    this.json = function(body){
        headers[BODY_TYPE_STR] = mimetypes['json'];
        that.send(JSON.stringify(body));
    };

    this.type = function(type){
        headers[BODY_TYPE_STR] = mimetypes[type];
    };

    this.reset = function(){
        headers = {};
        cookies = {};
        statusCode = "200";
        headers[BODY_TYPE_STR] = mimetypes['html'];
        return that;
    };

    this.wasSent = function(){
        return sent;
    }

}
