
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

}

module.exports.static = function(rootFolder) {

}

module.exports.myUse = function() {

    this.toString() = function() {

    }
}

function serverObj(port, callback) {

    //TODO initiate actual server
    //TODO save port as read-only

    this.use = function(requestHandler) {
        /* TODO handle params.length === 2, resource = requestHandler,
         * and so on.
         */
    }

    this.stop = function(callback) {

    }

}
