/* Author:

*/


function alarm() {
    $('body').animate({backgroundColor:$.Color("red")}, 700, 'swing');
    $('body').animate({backgroundColor:$.Color("white")}, 700, 'swing');
}
function pomodoro_done(socket, interval) {
    socket.emit('pomodoro_done');
    clearInterval(interval);
    alarm();
    alarm();
    alarm();
}
$(function(){
    _.mixin(_.string.exports());
    var settings = {};
    var interval;
    console.log = function(msg){$('p#con').append(msg);};
    var socket = io.connect('http://localhost');
    socket.on('pomodoro_start', function() {
        var start = Date.now();
        interval = setInterval(function () {

            var elapsed_time = Date.now() - start;
            if (elapsed_time > settings.pomodoro) {
                pomodoro_done(socket, interval);
                return;
            }
            printTime(Math.floor(elapsed_time/1000));
        }, 1000);
    });
    socket.on('pomodoro_stop', function(){
        pomodoro_done(socket, interval);
    });
    socket.on('settings', function(msg){
        settings = msg;
    })
});

function printTime(seconds){
    var minutes = Math.floor(seconds / 60);
    var secs = seconds % 60;
   $('#timer').text(_.lpad(minutes.toString(),2,'0')+":"+_.lpad(secs.toString(),2,'0'));
}

