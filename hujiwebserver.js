var hujinet = require('./hujinet');

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

}

module.exports.myUse = function() {

    this.toString() = function() {
        //TODO add a description
    }
}

function HujiWebServer(port, callback) {
    var connHandler = new hujinet.ConnectionHandler(this, callback);
    var router = new Router();

    Object.defineProperty(this, 'port', {
        value: port
    });

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

        // TODO bind the resource
    }

    this.stop = function(callback) {
        connHandler.stop(callback);
    }

}
