const express = require('express');
const app = express()
const todo = require('./Backend/hackerearth');
var port = process.env.PORT || 2000;

const socketio = require('socket.io') ///////////////
const http = require('http')          //////////////
const server = http.createServer(app) //////////////
const io = socketio(server)           /////////////

let usersockets = {}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(__dirname + "/Frontend"));

io.on('connection', (socket) => {
    console.log("New socket formed from " + socket.id)

})

app.use('/todo/', todo);

console.log("Server started at http://localhost:2000/");

app.listen(port);