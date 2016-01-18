var HTTP_PROTOCOL = "http";

module.exports = function(query, method, cookies, path, host, protocol, body) {

    this.query = query;
    this.method = method;
    this.cookies = cookies;
    this.path = path;
    this.host = host;

    if(protocol != null)
        this.protocol = protocol;
    else
        this.protocol = HTTP_PROTOCOL;

    this.body = body;

    this.get = function(field)
    {

    }

    this.param = function(name)
    {

    }

    this.is = function(type)
    {

    }
}
