var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-led", "LED", LedAccessory);
}

function LedAccessory(log, config) {
    this.log = log;
    this.config = config;
    this.name = config["name"];
    this.color = config["color"]

    this.service = new Service.Lightbulb(this.name);
    this.service
        .getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));
}

LedAccessory.prototype.getOn = function(callback) {
    request.get({
        url: 'http://192.168.1.24:3000/led',
        qs: { name: this.color }
    }, function(err, response, body) {
        var status = body == 'on' ? true : false;
        callback(null, status);
    }.bind(this));
}

LedAccessory.prototype.setOn = function(on, callback) {
    var urlState = on ? "on": "off";
    request.put({
        url: 'http://192.168.1.24:3000/led',
        qs: { name: this.color, state: urlState  }
    }, function(err, response, body) {
        callback(null, on);
    }.bind(this));
}

LedAccessory.prototype.getServices = function() {
    return [this.service];
}
