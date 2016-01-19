module.exports = function(headers) {

    var headers = headers;

    /*
    set(field, value)
    status(code)
    get(field)
    cookie(name, value, [options])
    send(body)
    json(body)
    */

    //search for a matching object key to prop, Case Insensitive.
    var CIgetProperty = function(object, prop){
        var objectKeys = Object.keys(object);
        var objectRelevantKeys = objectKeys.filter(function (oProp) {
            return oProp.toLowerCase() === prop.toLowerCase();
        });

        return objectRelevantKeys;
    };

    this.set = function(field, value){

        var argsObj;

        if(arguments.length === 1){

            argsObj = arguments[0];

            for(var tempNewHeader in argsObj)
            {
                if(argsObj.hasOwnProperty(tempNewHeader)){
                    headers[tempNewHeader] = argsObj[tempNewHeader];
                }

            }
        }

        else{
            headers[field] = value;
        }
    };

    this.status = function(code){

    };

    this.get = function(field){
        var tempKeys = CIgetProperty(headers, field);

        //no CI match
        if(tempKeys.length <= 0){
            return undefined;
        }

        //if there's a match, return the first matching key value
        return headers[tempKeys[0]];

    };

    //should have options optionally
    this.cookie = function(name, value) {

    };

    this.send = function(body){

    };

    this.json = function(body){

    };

}
