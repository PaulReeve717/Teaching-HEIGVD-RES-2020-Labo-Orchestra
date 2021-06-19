const dgram = require('dgram');
const {v4: uuidv4} = require('uuid');
const {PORT, ADDRESS} = require('./config');
const {LOG} = require('./logger');

const uuid = uuidv4();

const [type] = process.argv.slice(2); //instrument wanted /!\ case sensitive
const instrumentSounds = new Map([
    ['piano', 'ti-ta-ti'],
    ['trumpet', 'pouet'],
    ['flute', 'trulu'],
    ['violin', 'gzi-gzi'],
    ['drum', 'boum-boum']
]);

const sound = instrumentSounds.get(type);
if (!sound) throw new Error(`No instrument '${type}' found.`);


const socket = dgram.createSocket('udp4');
const activeSince = new Date();
setInterval(() => {
    const payload = JSON.stringify({
        uuid,
        sound,
        activeSince
    });
    const message = Buffer.from(payload);
    socket.send(message, 0, message.length, PORT, ADDRESS, (error) => {
        if (error) {
            LOG.ERROR(error.toString());
            return;
        }
        LOG.INFO(`Sending payload ${payload} via port ${socket.address().port}`);
    })
}, 1000)
