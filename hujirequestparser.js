var HTTP_METHOD = 'method';
var METHOD_INDEX = 0;
var HTTP_URI = 'uri';
var URI_INDEX = 1;
var HTTP_VERSION = 'version';
var VERSION_INDEX = 2;
var SPACE_SEPARATOR = ' ';
var COLON_SEPARATOR = ':';
var SEMICOLON_SEPARATOR = ';';
var EQUAL_SEPARATOR = '=';
var LINE_SEPARATOR = '\r\n';
var COOKIE_HEADER = 'Cookie';

var REQUEST_FORMAT_INVALID = new Error("The provided HTTP request format was invalid!");

var url = require('url');

//parse the main packet headerf
function parseFirstHeader(header) {
    var headerParts = header.split(SPACE_SEPARATOR);
    var headerPartsDivided = {};
    headerPartsDivided[HTTP_METHOD] = headerParts[METHOD_INDEX];
    headerPartsDivided[HTTP_URI] = headerParts[URI_INDEX];
    headerPartsDivided[HTTP_VERSION] = headerParts[VERSION_INDEX];
    return headerPartsDivided;
}

//parse the cookie header, and return cookies object
function parseCookies(headers){
    var cookies = {};
    var cookiesStr, splitCookies;
    var tempSplitCookie;

    if(headers.hasOwnProperty(COOKIE_HEADER)) {
        cookiesStr = headers[COOKIE_HEADER];
        splitCookies = cookiesStr.split(SEMICOLON_SEPARATOR);

        for (var tempCookie in splitCookies) {

            if(splitCookies.hasOwnProperty(tempCookie)){
                tempCookie = tempCookie.trim();
                tempSplitCookie = tempCookie.split(EQUAL_SEPARATOR);
                cookies[tempSplitCookie[0]] = tempSplitCookie[1];
            }
        }
    }

    return cookies;
}

module.exports.parse = function(requestString) {

    //split by lines, remove first useless line
    var requestLines = requestString.split(LINE_SEPARATOR);
    var header;
    var headers = [];
    var headerKey;
    var headerBody;

    var fullUrl, parsedUrl;
    var query, method, cookies, path, host, version, protocol, body;

    //parse first request line
    var firstHeaderParts = parseFirstHeader(requestLines[0]);
    method = firstHeaderParts[HTTP_METHOD];
    version = firstHeaderParts[HTTP_VERSION];
    fullUrl = firstHeaderParts[HTTP_URI];

    parsedUrl = url.parse(fullUrl, true);
    query = parsedUrl.query;
    path = parsedUrl.pathname;
    //in case there's a port in the host name
    host = (parsedUrl.host).split(COLON_SEPARATOR)[0];

    //if protocol is present in the url
    if(parsedUrl.hasOwnProperty('protocol'))
        protocol = (parsedUrl.protocol).split(COLON_SEPARATOR)[0];
    else
        protocol = null;

    //get to the body part
    requestLines.splice(0,1);
    while ((header = requestLines.shift()) !== undefined && header !== '')
    {
        header = header.split(COLON_SEPARATOR);
        // Headers must have a key and a body
        if (header.length < 2) {
            throw REQUEST_FORMAT_INVALID;
        }
        headerKey = header.shift();
        headerBody = header.join(COLON_SEPARATOR).trim();
        headers[headerKey] = headerBody;
    }


    //all the remaining lines in requestLines are the request body.
    body = requestLines.join(LINE_SEPARATOR);
    cookies = parseCookies(headers);
    return new request(headers, query, method, cookies, path, host, version, protocol, body);
};
