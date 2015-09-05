/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses its web server

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var Client = require("ibmiotf").IotfApplication;


// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();


var config = Client.parseConfigFile("./app.config");
var appClient = new Client(config);

appClient.connect();

appClient.on("connect", function () {

    appClient.subscribeToDeviceEvents();

});



// start server on the specified port and binding host
app.listen(appEnv.port, function() {
	// print a message when the server starts listening
  	console.log("server starting on " + appEnv.url);
  	console.log(__dirname);
});

function handler (req, res) {
  fs.readFile(__dirname + '/public/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  	var counter = 0;
  	console.log('a user connected');
  
  	appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
		console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
		socket.emit('news', "Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload+" Counter : "+counter);
		counter++;
	});
  
  //socket.on('my other event', function (data) {
  //  console.log(data);
});


