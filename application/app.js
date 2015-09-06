/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses its web server
var app = require('http').createServer(handler)

// we use socket.io for real-time server-client updates
var io = require('socket.io')(app);
var fs = require('fs');
var Client = require("ibmiotf").IotfApplication;


// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// get credentials (ID, Org, API key & token) from config file
var config = Client.parseConfigFile("./app.config");
var appClient = new Client(config);

// connect to IoT Foundation
appClient.connect();

// subscribe to IoT devices events
appClient.on("connect", function () {

    appClient.subscribeToDeviceEvents();

});

// start server on the specified port and binding host
app.listen(appEnv.port, function() {
	// print a message when the server starts listening
  	console.log("server starting on " + appEnv.url);
  	console.log(__dirname);
});

// handle http request and response
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

// listen to web client connect request
io.on('connection', function (socket) {
  	var counter = 0;
  	console.log('a user connected');
    
    // receive events from IoT devices  
  	appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
		  console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
		
      // send event received from IoT devices to web client
      socket.emit('news', "Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload+" Counter : "+counter);
		  counter++;
    });
  
    // receive messages and commands from web client
    socket.on('my other event', function (data) {
      console.log(data);
    });
});


