const express = require('express');
const path = require('path')
const socketio = require('socket.io') ///////////////
const http = require('http')   //////////////

const app = express()
const server = http.createServer(app) //////////////
const io = socketio(server)           /////////////

const main = require('./Backend/main');

var port = process.env.PORT || 2000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(__dirname + "/Frontend"));

io.on('connection', (socket) => {
    console.log("New socket formed from " + socket.id)

    socket.on('send', async (data) => {
        code = data.task;
        input = data.input;
        language = data.language;

        let result = await main.compile(code, input, language);

        if (result.status === 0) {
            console.log("error while compiling the code");
            socket.emit('rcv', result.final)
        }
        else if (result.status === 1) {
            console.log("compiled with errors in code");
            socket.emit('rcv', result.final)
        }
        else {
            console.log("--------------successfully compile---------------");

            let result2 = await main.run(code, input, language);

            if (result2.status === 0) {
                console.log("error while running the code");
                socket.emit('rcv', result2.final)
            }
            else if (result2.status === 1) {
                console.log("run with errors in code");
                socket.emit('rcv', result2.final)
            }
            else {
                console.log("-------------------successfully run---------------------");
                console.log("server.js" + result2.final.id + " " + socket.id);
                socket.emit('rcv', result2.final)
            }
        }
    })
})

console.log("Server started at http://localhost:2000/");
server.listen(port);