var Client = require("ibmiotf").IotfDevice;

/*
var config = {
"org" : "s6fyy9",
"id" : "8c2daa552661",
"type" : "iMac",
"auth-method" : "token",
"auth-token" : "5DmyKtN&53i1Xfh6u4"
};
*/

var config = Client.parseConfigFile("./config.json");
var deviceClient = new Client(config);

deviceClient.connect();

deviceClient.on("connect", function () {
//Add your code here
	console.log("connected");

//publishing event using the default quality of service
	deviceClient.publish("status","json",'{"d" : { "cpu" : 60, "mem" : 50 }}');

});


