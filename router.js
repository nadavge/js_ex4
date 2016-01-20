const URI_VAR_INITIAL = ':'

/**
* @brief Holds a url and its corresponding handler
*
* @param url the pathname with param symbols (:)
* @param handler the request handler for the url
*/
function urlMap(url, handler) {
    Object.defineProperty(this, 'url', {
        value: url
    });

    Object.defineProperty(this, 'handler', {
        value: handler
    });
}

/**
* @brief A route match result, holding the handler, the params object, and the
*   index in the router of the match
*
* @param handler The request handler
* @param params The params object, mapping url params to values
* @param index The index of the match in router's list
*
*/
function matchResult(handler, params, index) {
    Object.defineProperty(this, 'handler', {
        value: handler
    });

    Object.defineProperty(this, 'params', {
        value: params
    });

    Object.defineProperty(this, 'index', {
        value: index
    });
}

/**
* @brief Routes urls to their corresponding handlers
*/
function Router() {
    var map = new Array();

    /**
    * @brief Route a given url to its request handler. Can start from last
    *   mapping in the router
    *
    * @param url The url pathname
    * @param lastMatch the lest match object of type matchResult
    *
    * @return The next match, undefined if non-existent
    */
    this.route = function(url, lastMatch) {
        var i;

        if (lastMap === undefined) {
            i = 0;
        } else {
            i = lastMap.index+1;
        }

        for (; i < map.length; ++i) {
            //TODO match the pathname
            //TODO return with start+1
        }
    }

    this.add = function(url, handler) {
        map.push(new urlMap(url, handler));
    }
}

/**
* @brief Match a _use_ url to a pathname
*
* @return an object whose property names are the variables in the _use_ url,
*   and the values are the corresponding values in the pathname provided.
*   If match was unsuccessful returns null
*/
function match(url, path) {
    var i = 0;
    var params = {};
    var paramName;

    /*
     * Split the url and the path, and match each part seperatly.
     * If the part starts with ':', use it as a property name,
     * otherwise match the whole part
     */
    url = url.split('/');
    path = path.split('/');

    // In case the url ends with a seperator, remove the last part.
    // (Doesn't handle weird cases like /a/b//)
    if (url[url.length-1].length == 0) {
        url.pop();
    }

    if (path.length < url.length) {
        return null;
    }

    for (i = 0; i < url.length; ++i) {
        console.log(i);
        console.log(url[i]);
        if (url[i].length > 0 && url[i][0] === URI_VAR_INITIAL) {
            // Use the remainder of this part of the url as the param name
            paramName = url[i].substr(1);
            params[paramName] = path[i];
        } else {
            if (url[i] !== path[i]) {
                return null;
            }
        }
    }

    return params;
}

module.exports = Router;
