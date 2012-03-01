/* Author:

*/


$(function(){
    _.mixin(_.string.exports());
    console.log = function(msg){$('p#con').append(msg);};
    console.log("got it?");
    var socket = io.connect('http://localhost');
    var seconds = 0;
    var period = 25*60;
    socket.on('pomodoro_start', function(new_period){
        period = new_period;
        seconds = 0;
        var interval = setInterval(function(){
            seconds++;
            if (seconds > period) {
                socket.emit('pomodoro_done')
                clearInterval(interval);
                return;
            }
            printTime(seconds);
        }, 1000);
    });
    socket.emit('msg');
});

function printTime(seconds){
    var minutes = Math.floor(seconds / 60);
    var secs = seconds % 60;
   $('#timer').text(_.lpad(minutes.toString(),2,'0')+":"+_.lpad(secs.toString(),2,'0'));
}

