var fs = require('fs');
var path = require('path');
var hujinet = require('./hujinet');
var Router = require('./router');

const CODE_PAGE_NOT_FOUND = 404;
const BODY_PAGE_NOT_FOUND = 'The requested resource not found';

/**
* @brief Start a new huji webserver
*
* @param port The port to start on
* @param callback The callback for the server initialization
*    received an error, handles server setup success/failure
*
* @return server as serverObj
*/
module.exports.start = function(port, callback) {
    return new HujiWebServer(port, callback);
}

/**
* @brief Handle requests for a static webserver relative to rootFolder
*
* @param rootFolder the root of the static serving folder
*
* @return a request handler for a static webserver
*/
module.exports.static = function(rootFolder) {

    return function(request, response, next) {
        var filepath;

        // Avoid access from outside the rootFolder
        if (! path.isAbsolute(request.path)) {
            response.status(403).send('');
        }

        filepath = path.join(rootFolder, request.path);
        fs.stat(filepath, function(err, stats) {
            var extension;

            if (err) {
                response.status(404).send('');
                return;
            }

            if (! stats.isFile()) {
                response.status(403).send('');
                return;
            }

            extension = path.extname(filepath).substring(1);
            fs.readFile(filepath, function(err, data) {
                if (err) {
                    response.status(404).send('');
                    return;
                }

                response.type(extension);
                response.send(data);
            });
        });
    };
}

/**
* @brief A handler to redirect urls to a new url
*
* @param newUrl the new url to redirect to
*
* @return A handler, that handles HTTP requests and redirects them
*/
module.exports.myUse = function(newUrl) {

    return function(request, response, next) {
        response.status(302).set('Location', newUrl);
        response.send('');
    };

    this.toString() = function() {
        return `Allows redirection of a resource to a new url, useful for login
            redirections, site restructuring, new domain, and many more use cases`;
    }
}

/**
* @brief A huji web server, capable of dynamic HTTP handling.
*   runs on a specified port.
*
* @param port the port to run on
* @param callback a success/fail callback for the initialization
*/
function HujiWebServer(port, callback) {
    var connHandler;
    var router;
    var that = this;

    Object.defineProperty(this, 'port', {
        value: port
    });

    connHandler = new hujinet.ConnectionHandler(this, callback);
    router = new Router();

    /**
    * @brief Bind the resource to the given requestHandler. If no resource was
    *    specified, use '/' as the resource
    *
    * @param resource The resource. optional, defaults to '/'
    * @param requestHandler The request handler for the resource
    */
    this.use = function(resource, requestHandler) {
        // If only requestHandler was passed, use root as the resource
        if (requestHandler === undefined) {
            requestHandler = resource;
            resource = '/';
        }

        router.add(resource, requestHandler);
    }

    /**
    * @brief Route a request to its matching handler. In case it's been called
    *   from next, search from the last match (lastMatch)
    *
    * @param request the HTTP request object
    * @param response the HTTP response object
    * @param lastMatch the last match for the given path
    */
    this.route = function(request, response, lastMatch) {
        var match;

        match = router.route(request.path, lastMatch);
        if (match === null) {
            response
                .reset().status(CODE_PAGE_NOT_FOUND).send(BODY_PAGE_NOT_FOUND);
        } else {
            request.setUrlParams(match.params);
            match.handler(request, response, function() {
                that.route(request, response, match);
            });

            // In case none of the response handlers sent, send page not found
            if (! response.wasSent()) {
                response
                    .reset().status(CODE_PAGE_NOT_FOUND).send(BODY_PAGE_NOT_FOUND);
            }
        }
    }

    /**
    * @brief Stop the server, and call the callback on either success or failure
    *
    * @param callback the handling function for the termination
    */
    this.stop = function(callback) {
        connHandler.stop(callback);
    }

}
