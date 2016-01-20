/**
* @brief Holds a url and its corresponding handler
*
* @param url the pathname with param symbols (:)
* @param handler the request handler for the url
*/
function urlMap(url, handler) {

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
        value: handler;
    });

    Object.defineProperty(this, 'params', {
        value: params;
    });

    Object.defineProperty(this, 'index', {
        value: index;
    });
}

/**
* @brief Routes urls to their corresponding handlers
*/
function Router() {
    var map = new Array();

    /**
    * @brief Match a given url to its request handler. Can start from last
    *   mapping in the router
    *
    * @param url The url pathname
    * @param lastMatch the lest match object of type matchResult
    *
    * @return The next match, undefined if non-existent
    */
    this.match = function(url, lastMatch) {
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
}

module.exports = Router;
