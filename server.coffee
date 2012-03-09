express = require "express"
cocoa = require('NodObjC')
app = express.createServer()
io = require("socket.io").listen app
 
app.use express.static(__dirname + '/public')
app.use express.errorHandler { showStacktrace: true, dumpExceptions: true }

cocoa.import('Foundation')
cocoa.import('AppKit')

pool = cocoa.NSAutoreleasePool('alloc')('init')
msg_pomodoro_done = cocoa.NSString 'stringWithUTF8String', 'Pomodoro is done'
msg_pomodoro_started = cocoa.NSString 'stringWithUTF8String', 'Pomodoro just started'
speach_synthesizer = cocoa.NSSpeechSynthesizer('alloc')('init')
speach_synthesizer('startSpeakingString',msg_pomodoro_done)

io.sockets.on 'connection', (socket) ->
	socket.on 'msg', () ->
    console.log 'Got the message over here'

  socket.on 'pomodoro_done', () ->
    console.log 'pomodoro is done'
    speach_synthesizer('startSpeakingString',msg_pomodoro_done)

  socket.emit 'pomodoro_start', 25*60
  speach_synthesizer('startSpeakingString',msg_pomodoro_started)

app.listen 9112
