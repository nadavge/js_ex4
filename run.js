var hujiserver = require('./hujiwebserver');

var server = hujiserver.start(8000, function(e) {
	if(e) {
		console.log(e)
	} else {
		console.log('Server is up');
        server.use('/', hujiserver.static('./ex2'));
	}
});

