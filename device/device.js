var Client = require("ibmiotf").IotfDevice;
var stdin = process.openStdin();

var config = Client.parseConfigFile("./config.json");
var deviceClient = new Client(config);

deviceClient.connect();

deviceClient.on("connect", function () {

	console.log("connected");
	console.log("Hit <Enter> to fire event");
	
	var count = 0;
	
	stdin.on('data', function(chunk) { 
		
		count++;

		//publishing event using the default quality of service
		deviceClient.publish("status","json",'{"d" : { "cpu" : 60, "mem" : 50, "count" : '+count+'}}');

		console.log(count); 
		console.log("Hit <Enter> to fire event");
	});

});

