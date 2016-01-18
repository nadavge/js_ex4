var net = require('net');
var requestParser = require('./hujirequestparser');

const CONNECTION_TIMEOUT = 2000; // Connection timeout in ms

/**
* @brief Connection handler for a hujiwebserver
*
* @param hujiwebserver the hujiwebserver whose connections are handled
* @param callback the callback to call upon initialization success/failure
*
* @return A connection handler
*/
module.exports.ConnectionHandler = function(hujiwebserver, callback) {
    var server = net.createServer(function(conn) {

        // Handle connection timeout
        var timer = setTimeout(function() { conn.end(); }, CONNECTION_TIMEOUT);

        conn.on('data', function(data) {
                var request;
                var response;

                clearTimeout(timer);
                timer = setTimeout(function() { conn.end(); }, CONNECTION_TIMEOUT);

                data = data.toString('ascii', 0, data.length)

                try {
                    request = requestParser.parse(data);
                    /* TODO Transfer the request to the relevant handler using the router
                     * the connection should be embedded in the response
                     * hujiwebserver.route(request, response);
                     */
                } catch (e) {
                    // TODO Handle a faulty HTTP, and send 500
                    // conn.end(RESPONSE with 500);
                }
            }
        );

        // To avoid double closing of the connection
        conn.on('end', function() {
                clearTimeout(timer);
            }
        );

    });

    this.stop = function(callback) {
        server.close(callback);
    }
}
