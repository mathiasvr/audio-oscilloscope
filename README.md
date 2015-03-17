# audio-oscilloscope
Waveform audio visualizer using html5 canvas.

Require the module with browserify, or simply include oscilloscope.min.js

## Methods

 * addSignal(source:AudioNode, color)
 * start()
 * stop()

## Example

```javascript
oscilloscope = require('..')

var context = new window.AudioContext()

// setup canvas
var canvas = document.querySelector('.visualizer')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var options = {
  stroke: 3,		// size of the wave
  glow: 0.1,		// glowing effect
  buffer: 1024  // buffer size ranging from 32 to 2048
}

// attach oscilloscope
var scope = new Oscilloscope(canvas, options)

// get user microphone
var constraints = { video: false, audio: true };
navigator.getUserMedia(constraints, function(stream) {
  var source = context.createMediaStreamSource(stream)
  scope.addSignal(source, '#00ffff')
}, function (error) {
  console.error("getUserMedia error:", error);
});

```
