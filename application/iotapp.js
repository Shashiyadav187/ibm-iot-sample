var Client = require("ibmiotf").IotfApplication;

var config = Client.parseConfigFile("./app.config");
var appClient = new Client(config);

appClient.connect();

appClient.on("connect", function () {

    appClient.subscribeToDeviceEvents();

});

appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {

    console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);

});
