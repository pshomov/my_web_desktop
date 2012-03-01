# This is it
express = require "express"
app = express.createServer()
io = require("socket.io").listen app
 
app.use express.static(__dirname + '/public')
app.use express.errorHandler { showStacktrace: true, dumpExceptions: true }



io.sockets.on 'connection', (socket) ->
	socket.on 'msg', () ->
    console.log 'Got the message over here'

  socket.on 'pomodoro_done', () ->
    console.log 'pomodoro is done'

  socket.emit 'pomodoro_start', 25*60

app.listen 9112
