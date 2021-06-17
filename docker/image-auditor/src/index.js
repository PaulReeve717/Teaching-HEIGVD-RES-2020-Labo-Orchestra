const net = require('net');
const dgram = require('dgram');
const {UDP_PORT, UDP_ADDRESS, TCP_PORT, INSTRUMENT_TIMEOUT} = require("./config");
const {LOG} = require("./logger");
const s = dgram.createSocket('udp4');
const instruments = new Map();

s.bind(UDP_PORT, () => {
    LOG.INFO("Joining multicast group");
    s.addMembership(UDP_ADDRESS);
});

s.on('message', (msg, source) => {
    LOG.INFO("Data has arrived: " + msg + ". Source port: " + source.port + " " + source.address);
    try {
        const payload = JSON.parse(msg.toString('utf8'));

        if (!instruments.has(payload.uuid)) {
            LOG.WARN(`Ho a new ${payload.type}[${payload.uuid}] arrive !`); //for yellow color :)
        }

        /**
         * Recreation of all the object, but we can edit only the lastEared value with
         * instruments.get(payload.uuid).lastEared = new Date(), but we use the easy way
         */
        instruments.set(payload.uuid, {
            data: {
                uuid: payload.uuid,
                instrument: payload.type,
                activeSince: payload.activeSince
            },
            lastEared: new Date()
        })
    } catch (error) {
        LOG.ERROR('An error occurred', error);
    }
});

//Check timeout
setInterval(() => {
    instruments.forEach((i, key) => {
        if ((Date.now() - i.lastEared.getTime()) > INSTRUMENT_TIMEOUT) {
            LOG.WARN(`A ${i.data.instrument}[${i.data.uuid}] is silent for too long !`); //for yellow color :)
            instruments.delete(key);
        }
    })
}, 1000);

//TCP
const server = net.createServer((socket) => {
    LOG.INFO(`New client connected: ${socket.remoteAddress}`);
    socket.write(JSON.stringify([...instruments.values()].map(a => a.data)))
    socket.end();
});

server.listen(TCP_PORT);