var net = require('net');
var requestParser = require('./hujirequestparser');
var Response = require('./response');

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
                } catch (e) {
                    console.log('Error occured while parsing: ' + e);
                    response = new Response(DEFAULT_HTTP_VERSION, conn);
                    response.status(CODE_SERVER_ERROR).send(BODY_SERVER_ERROR);
                    conn.end();
                    return;
                }

                response = new Response(request.version, conn);

                try {
                    hujiwebserver.route(request, response);
                } catch (e) {
                    console.log('Error occured while responding: ' + e);
                    response
                        .reset().status(CODE_SERVER_ERROR).send(BODY_SERVER_ERROR);
                    conn.end();
                    return;
                }

                if (request.shouldClose()) {
                    conn.end();
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
