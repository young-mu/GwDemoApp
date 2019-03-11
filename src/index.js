'use strict';

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    console.log('Hello, Ruff');

    // 下行

    var uartOptions = {
        "baudRate": 9600,
        "dataBits": 8,
        "stopBits": 1,
        "parity": "none",
        "flowControl": "none"
    };

    $('#uartext-1').setup(uartOptions, function () {
        $('#uartext-1').open();
    });

    $('#uartext-1').on('data', function (data) {
        // data is Buffer type
        console.log(data);
        console.log(data.length);

        // write back
        $('#uartext-1').write(data);
    });


    // 上行

    var mqtt = require('mini-mqtt-client');

    var mqttTopic = "demoTopic";
    var mqttOptions = {
        "protocol": "mqtt",
        "host": "iotfreetest.mqtt.iot.gz.baidubce.com",
        "port": 1883,
        "clientId": "MQTT_FX_Client_Ruff1",
        "username": "iotfreetest/thing01",
        "password": "YU7Tov8zFW+WuaLx9s9I3MKyclie9SGDuuNkl6o9LXo="
    };

    var client = mqtt.connect(mqttOptions);

    client.on('connect', function () {
        console.log('connect');
        client.subscribe(mqttTopic);
        var i = 0;
        setInterval(function () {
            client.publish(mqttTopic, 'Hello Ruff @ ' + i++);
        }, 5000);
    });

    client.on('message', function (topic, message) {
        console.log('topic:', topic);
        console.log('message:', message.toString());
    });

});

$.end(function () {
});
