const dgram = require('dgram');
const {v4: uuidv4} = require('uuid');
const {PORT, ADDRESS} = require('./config');

const uuid = uuidv4();

const [type] = process.argv.slice(2); //instrument wanted
const instruments = new Map();
instruments.set('piano', 'ti-ta-ti');
instruments.set('trumpet', 'pouet');
instruments.set('flute', 'trulu');
instruments.set('violin', 'gzi-gzi');
instruments.set('drum', 'boum-boum');

const sound = instruments.get(type);
if (!sound) throw new Error(`No instrument '${type}' found.`);


const socket = dgram.createSocket('udp4');
setInterval(() => {
    const payload = JSON.stringify({
        uuid,
        type,
        sound,
        timestamp: Date.now()
    });
    const message = Buffer.from(payload);
    socket.send(message, 0, message.length, PORT, ADDRESS, (error) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log(`Sending payload ${payload} via port ${socket.address().port}`);
    })
}, 1000)