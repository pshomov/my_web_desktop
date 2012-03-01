# This is it
express = require "express"
app = express.createServer()
io = require("socket.io").listen app
 
app.use express.static(__dirname + '/public')
app.use express.errorHandler { showStacktrace: true, dumpExceptions: true }



io.sockets.on 'connection', (socket) ->
	socket.on 'msg', () ->
    console.log 'Got the message over here'
  socket.emit 'pomodoro_start'

app.listen 9112
