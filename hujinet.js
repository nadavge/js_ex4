var net = require('net');
var requestParser = require('./hujirequestparser');
var Response = require('./response');

const CONNECTION_TIMEOUT = 2000; // Connection timeout in ms
const DEFAULT_HTTP_VERSION = 'HTTP/1.0';
const CODE_SERVER_ERROR = 500;
const BODY_SERVER_ERROR = 'Internal Server Error';

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

                // Timeout timer for the connection
                clearTimeout(timer);
                timer = setTimeout(function() { conn.end(); }, CONNECTION_TIMEOUT);

                data = data.toString('ascii', 0, data.length)

                try {
                    request = requestParser.parse(data);
                } catch (e) {
                    console.log('Error occured while parsing: ' + e);
                    response = new Response(DEFAULT_HTTP_VERSION, conn);
                    response.status(CODE_SERVER_ERROR).send(BODY_SERVER_ERROR);
                    conn.end();
                    return;
                }

                response = new Response(request.version, conn);
                // Check whether the request hints for a connection close
                if (request.shouldClose()) {
                    response.shouldClose();
                }

                try {
                    hujiwebserver.route(request, response);
                } catch (e) {
                    console.log('Error occured while responding: ' + e);
                    response
                        .reset().status(CODE_SERVER_ERROR).send(BODY_SERVER_ERROR);
                    conn.end();
                    return;
                }
            }
        );

        conn.on('end', function() {
                clearTimeout(timer);
            }
        );

    });

    /**
    * @brief Stop the connection listener
    *
    * @param callback the success/fail callback
    */
    this.stop = function(callback) {
        server.close(callback);
    }

    server.on('error', callback);
    server.listen(hujiwebserver.port, callback);
}
