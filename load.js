var serverObj;
var http = require('http');
var hujiServer = require('./hujiwebserver');
var servPort = 1337;
//var filePath = '/index.html';
var rootFolder = './ex2';
//var fileUri = 'http://localhost:' + servPort + filePath;
var NUM_OF_CONCURRENT = 2000;
var SUCCESS_STATUS_CODE = 200;

var numOfSuccess = 0;
var numOfFails = 0;

serverObj = hujiServer.start(servPort, function(e){

    if(e) {
        console.log(e)
    } else {
        serverObj.use(function(request, response, next) {
            response.send(ipsum);
        });

        console.log('server is up. port ' + servPort);
        runTests();
        setTimeout(function() {
            serverObj.stop();
			console.log('Successes: ' + numOfSuccess +', Fails: ' + numOfFails);
        }, 5000);
    }
});


function runTests()
{
    for(var i = 0; i < NUM_OF_CONCURRENT; i++)
    {
		var req = http.get({
				port: servPort,
				path: '/'
			},
			function (response) {
				if(response.statusCode == SUCCESS_STATUS_CODE)
                {
                    numOfSuccess++;
                }

                else
                {
                    numOfFails++;
                }
			}
		).on('error', function() {
			numOfFails++;
		});
    }
}

var ipsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque varius tristique neque eu pellentesque. Aliquam ante massa, vehicula eu turpis et, commodo varius sapien. Praesent maximus rhoncus lorem in eleifend. Aliquam erat volutpat. Sed magna massa, semper nec dictum hendrerit, convallis sed nulla. Aliquam a augue vel lorem tincidunt tincidunt a volutpat lorem. Quisque luctus pharetra finibus. Fusce metus leo, pellentesque ut scelerisque nec, pharetra suscipit tortor. Aliquam erat volutpat. Pellentesque luctus lacus at nibh molestie, non facilisis est condimentum. Aliquam fermentum neque eu justo lobortis pellentesque. Aliquam viverra congue lacinia. Sed mollis magna et aliquet tincidunt. Ut vel luctus orci. Nam blandit rhoncus libero, sit amet vulputate tortor fringilla quis.

Fusce id quam quis magna feugiat molestie a consequat dolor. Fusce feugiat justo id fermentum rhoncus. Phasellus lobortis enim non velit sodales hendrerit. Donec rutrum aliquam elit, sed fringilla leo malesuada id. Integer volutpat tincidunt ipsum, eu congue leo molestie ultrices. Mauris ullamcorper ultrices aliquam. Sed a sollicitudin est. Maecenas nec justo enim. Ut erat nisl, porttitor eget interdum vel, egestas a ligula. Vestibulum augue tortor, venenatis ut tellus non, auctor aliquam lectus. Phasellus sollicitudin dapibus ornare. Integer et massa tristique, congue lectus in, ornare sem. Nullam nibh diam, mollis vitae bibendum sed, rutrum ut ligula. Maecenas in ligula eu ipsum aliquam iaculis.

Vestibulum at eros bibendum, tristique turpis at, blandit erat. Sed fermentum quam a porttitor finibus. Praesent vehicula vel nulla in convallis. Phasellus mollis purus et euismod finibus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse potenti. Duis varius facilisis nisl faucibus accumsan. Donec tincidunt quam nec arcu tincidunt, eget fermentum risus volutpat. Integer congue consequat nisi, in dictum massa mollis vehicula. Ut mollis dolor augue, id gravida ex sollicitudin quis.

Maecenas vitae dictum lorem, nec facilisis diam. Quisque vitae dapibus sapien. Nulla pellentesque laoreet ex quis pulvinar. Sed a ex non elit vestibulum tincidunt. Nulla sit amet felis vehicula, placerat mi vitae, pretium magna. Sed a nunc eu enim fringilla egestas. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras eu aliquam sem. Vivamus metus neque, semper sit amet pellentesque nec, luctus in velit. Pellentesque ut risus sed quam molestie aliquam. Etiam quis aliquet diam, ac molestie neque. Ut dignissim placerat ipsum. In eget accumsan sem. Donec scelerisque, ligula et volutpat blandit, sem ligula auctor magna, non rutrum eros est id lectus. Praesent ultricies, velit ut fringilla finibus, velit velit ultrices ipsum, id tempus orci magna a nisl.

Nam a pulvinar massa. Vivamus tincidunt lacus in posuere pharetra. Suspendisse ultricies, ligula vitae hendrerit posuere, ante elit molestie mauris, et pretium magna est vel magna. Morbi efficitur eget metus at volutpat. Suspendisse et nibh erat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eleifend tristique dolor ut cursus. Integer tincidunt risus in ipsum bibendum tempus. Cras ante dui, suscipit sed consectetur vitae, ornare sed leo. Aliquam viverra, erat non dictum gravida, ligula massa consequat magna, laoreet vestibulum ligula nisl ac dui. Sed lacinia hendrerit est hendrerit placerat. Sed pharetra ipsum non egestas luctus. Sed id magna iaculis, vulputate neque ut, sagittis odio. Quisque scelerisque fermentum malesuada. Integer vitae nulla id est vulputate convallis. Nam volutpat dolor in lacinia molestie.`;
