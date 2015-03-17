var oscilloscope = require('..')

// shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia || navigator.msGetUserMedia

var context = new (window.AudioContext || window.webkitAudioContext)()

// setup canvas
var canvas = document.querySelector('.visualizer')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var options = {
  stroke: 3,		// size of the wave
  glow: 0.1,		// glowing effect
  buffer: 1024	// buffer size ranging from 32 to 2048
}

// attach oscilloscope
var scope = new oscilloscope(canvas, options)

// get user microphone
var constraints = { video: false, audio: true };

navigator.getUserMedia(constraints, function(stream) {
  var source = context.createMediaStreamSource(stream)
  scope.addSignal(source, '#00ffff')
}, function (error) {
  console.error("getUserMedia error:", error);
});
