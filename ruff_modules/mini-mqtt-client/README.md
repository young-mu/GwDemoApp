This is a lite version of MQTT.js, only client mode is supported.

MQTT.js is a library for the [MQTT](http://mqtt.org/) protocol, written
in JavaScript. And this is a fork of original [MQTT.js](https://github.com/mqttjs/MQTT.js) for Ruff that currently supports only TCP connection.

* [Installation](#install)
* [Example](#example)
* [API](#api)
* [License](#license)

<a name="install"></a>
## Installation

```sh
rap install mini-mqtt-client --save
```

<a name="example"></a>
## Example

For the sake of simplicity, let's put the subscriber and the publisher in the same file:

```js
var mqtt    = require('mini-mqtt-client');
var client  = mqtt.connect({
  protocol: 'mqtt',
  host: 'test.mosquitto.org'
});

client.on('connect', function () {
  client.subscribe('presence');
  client.publish('presence', 'Hello Ruff!');
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log('topic:', topic);
  console.log('message:', message.toString());
  client.end();
});
```

### Output

```
topic: presense
message: Hello Ruff!
```

<a name="api"></a>
## API

  * <a href="#connect"><code>mqtt.<b>connect()</b></code></a>
  * <a href="#client"><code>mqtt.<b>Client()</b></code></a>
  * <a href="#publish"><code>mqtt.Client#<b>publish()</b></code></a>
  * <a href="#subscribe"><code>mqtt.Client#<b>subscribe()</b></code></a>
  * <a href="#unsubscribe"><code>mqtt.Client#<b>unsubscribe()</b></code></a>
  * <a href="#end"><code>mqtt.Client#<b>end()</b></code></a>
  * <a href="#handleMessage"><code>mqtt.Client#<b>handleMessage()</b></code></a>
  * <a href="#store"><code>mqtt.<b>Store()</b></code></a>
  * <a href="#put"><code>mqtt.Store#<b>put()</b></code></a>
  * <a href="#del"><code>mqtt.Store#<b>del()</b></code></a>
  * <a href="#createStream"><code>mqtt.Store#<b>createStream()</b></code></a>
  * <a href="#close"><code>mqtt.Store#<b>close()</b></code></a>

---

<a name="connect"></a>
### mqtt.connect(options)

Connects to the broker specified by the given options and
returns a [Client](#client).

You can specify a `servers` options with content: `[{ host:
'localhost', port: 1883 }, ... ]`, in that case that array is iterated
at every connect.

For all MQTT-related options, see the [Client](#client)
constructor.

---

<a name="client"></a>
### mqtt.Client(streamBuilder, options)

The `Client` class wraps a client connection to an
MQTT broker over an arbitrary transport method (TCP only in this fork).

`Client` automatically handles the following:

* Regular server pings
* QoS flow
* Automatic reconnections
* Start publishing before being connected

The arguments are:

* `streamBuilder` is a function that returns a subclass of the `Stream` class that supports
the `connect` event. Typically a `net.Socket`.
* `options` is the client connection options (see: the [connect packet](https://github.com/mcollina/mqtt-packet#connect)). Defaults:
  * `keepalive`: `10` seconds, set to `0` to disable
  * `reschedulePings`: reschedule ping messages after sending packets (default `true`)
  * `clientId`: `'mqttjs_' + Math.random().toString(16).substr(2, 8)`
  * `protocolId`: `'MQTT'`
  * `protocolVersion`: `4`
  * `clean`: `true`, set to false to receive QoS 1 and 2 messages while
    offline
  * `reconnectPeriod`: `1000` milliseconds, interval between two
    reconnections
  * `connectTimeout`: `30 * 1000` milliseconds, time to wait before a
    CONNACK is received
  * `username`: the username required by your broker, if any
  * `password`: the password required by your broker, if any
  * `incomingStore`: a [Store](#store) for the incoming packets
  * `outgoingStore`: a [Store](#store) for the outgoing packets
  * `queueQoSZero`: if connection is broken, queue outgoing QoS zero messages (default `true`)
  * `will`: a message that will sent by the broker automatically when
     the client disconnect badly. The format is:
    * `topic`: the topic to publish
    * `payload`: the message to publish
    * `qos`: the QoS
    * `retain`: the retain flag

If you are connecting to a broker that supports only MQTT 3.1 (not
3.1.1 compliant), you should pass these additional options:

```js
{
  protocolId: 'MQIsdp',
  protocolVersion: 3
}
```

This is confirmed on RabbitMQ 3.2.4, and on Mosquitto < 1.3. Mosquitto
version 1.3 and 1.4 works fine without those.

#### Event `'connect'`

`function(connack) {}`

Emitted on successful (re)connection (i.e. connack rc=0).
* `connack` received connack packet. When `clean` connection option is `false` and server has a previous session
for `clientId` connection option, then `connack.sessionPresent` flag is `true`. When that is the case,
you may rely on stored session and prefer not to send subscribe commands for the client.

#### Event `'reconnect'`

`function() {}`

Emitted when a reconnect starts.

#### Event `'close'`

`function() {}`

Emitted after a disconnection.

#### Event `'offline'`

`function() {}`

Emitted when the client goes offline.

#### Event `'error'`

`function(error) {}`

Emitted when the client cannot connect (i.e. connack rc != 0) or when a
parsing error occurs.

### Event `'message'`

`function(topic, message, packet) {}`

Emitted when the client receives a publish packet
* `topic` topic of the received packet
* `message` payload of the received packet
* `packet` received packet, as defined in
  [mqtt-packet](https://github.com/mcollina/mqtt-packet#publish)

---

<a name="publish"></a>
### mqtt.Client#publish(topic, message, [options], [callback])

Publish a message to a topic

* `topic` is the topic to publish to, `String`
* `message` is the message to publish, `Buffer` or `String`
* `options` is the options to publish with, including:
  * `qos` QoS level, `Number`, default `0`
  * `retain` retain flag, `Boolean`, default `false`
* `callback` callback fired when the QoS handling completes,
  or at the next tick if QoS 0.

---

<a name="subscribe"></a>
### mqtt.Client#subscribe(topic/topic array/topic object, [options], [callback])

Subscribe to a topic or topics

* `topic` is a `String` topic to subscribe to or an `Array` of
  topics to subscribe to. It can also be an object, it has as object
  keys the topic name and as value the QoS, like `{'test1': 0, 'test2': 1}`.
* `options` is the options to subscribe with, including:
  * `qos` qos subscription level, default 0
* `callback` - `function(err, granted)`
  callback fired on suback where:
  * `err` a subscription error
  * `granted` is an array of `{topic, qos}` where:
    * `topic` is a subscribed to topic
    * `qos` is the granted qos level on it

---

<a name="unsubscribe"></a>
### mqtt.Client#unsubscribe(topic/topic array, [options], [callback])

Unsubscribe from a topic or topics

* `topic` is a `String` topic or an array of topics to unsubscribe from
* `callback` fired on unsuback

---

<a name="end"></a>
### mqtt.Client#end([force], [cb])

Close the client, accepts the following options:

* `force`: passing it to true will close the client right away, without
  waiting for the in-flight messages to be acked. This parameter is
  optional.
* `cb`: will be called when the client is closed. This parameter is
  optional.

---

<a name="handleMessage"></a>
### mqtt.Client#handleMessage(packet, callback)

Handle messages with backpressure support, one at a time.
Override at will, but __always call `callback`__, or the client
will hang.

---

### Contributors

This fork is only possible due to the excellent work of the original contributors:

<table><tbody>
<tr><th align="left">Adam Rudd</th><td><a href="https://github.com/adamvr">GitHub/adamvr</a></td><td><a href="http://twitter.com/adam_vr">Twitter/@adam_vr</a></td></tr>
<tr><th align="left">Matteo Collina</th><td><a href="https://github.com/mcollina">GitHub/mcollina</a></td><td><a href="http://twitter.com/matteocollina">Twitter/@matteocollina</a></td></tr>
<tr><th align="left">Maxime Agor</th><td><a href="https://github.com/4rzael">GitHub/4rzael</a></td><td><a href="http://twitter.com/4rzael">Twitter/@4rzael</a></td></tr>
</tbody></table>

<a name="license"></a>
## License

MIT
