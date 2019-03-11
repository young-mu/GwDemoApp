'use strict';

var MqttClient = require('./lib/client.js');

var protocols = Object.create(null);
protocols.mqtt = require('./lib/tcp.js');

function parseAuthOptions(opts) {
    var matches;
    if (opts.auth) {
        matches = opts.auth.match(/^(.+):(.+)$/);
        if (matches) {
            opts.username = matches[1];
            opts.password = matches[2];
        } else {
            opts.username = opts.auth;
        }
    }
}

function connect(opts) {
    opts = opts || {};

    // merge in the auth options if supplied
    parseAuthOptions(opts);

    if (false === opts.clean && !opts.clientId) {
        throw new Error('Missing clientId for unclean clients');
    }

    function wrapper(client) {
        if (opts.servers) {
            if (!client._reconnectCount || client._reconnectCount === opts.servers.length) {
                client._reconnectCount = 0;
            }

            opts.host = opts.servers[client._reconnectCount].host;
            opts.port = opts.servers[client._reconnectCount].port;
            opts.hostname = opts.host;

            client._reconnectCount++;
        }

        return protocols[opts.protocol](client, opts);
    }

    return new MqttClient(wrapper, opts);
}

exports.connect = connect;
