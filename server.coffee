readline = require 'readline'
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

rl = readline.createInterface(process.stdin, process.stdout)
prompt = "web desktop> "
rl.setPrompt(prompt, prompt.length)
rl_on_close = () ->
  console.log 'Bye.'
  process.exit(0)

sockets = []


start_pomodoro = () ->
  socket.emit 'pomodoro_start' for socket in sockets
  speach_synthesizer('startSpeakingString',msg_pomodoro_started)

set_settings = (socket) ->
  socket.emit 'settings', {pomodoro : 25*60*1000, break : 5*60*1000}

stop_pomodoro = () ->
  socket.emit 'pomodoro_stop' for socket in sockets

rl.on("line", (line) ->
  switch line
    when 'start' then start_pomodoro()
    when 'stop' then stop_pomodoro()
    else console.log 'Hugh?'
  rl.prompt()
)
rl.on("close", rl_on_close)

io.set('log level', 1)
io.sockets.on 'connection', (socket) ->
  socket.on 'pomodoro_done', () ->
    console.log 'pomodoro is done'
    speach_synthesizer('startSpeakingString',msg_pomodoro_done)
  socket.on 'disconnect', () ->
    sockets.splice(sockets.indexOf(socket), 1)

  console.log 'connection'
  sockets.push(socket)
  set_settings socket

app.listen 9112
rl.prompt()
