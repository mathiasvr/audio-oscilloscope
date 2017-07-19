// shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia || navigator.msGetUserMedia

var audioContext = new window.AudioContext()

// setup canvas
var canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)

// customize drawing options
var ctx = canvas.getContext('2d')
ctx.lineWidth = 2
ctx.strokeStyle = '#ffffff'

// get user microphone
var constraints = { video: false, audio: true }
navigator.getUserMedia(constraints, function (stream) {
  var source = audioContext.createMediaStreamSource(stream)

  // attach oscilloscope
  var scope = new Oscilloscope(source)

  // start default animation loop
  scope.animate(ctx)
}, function (error) {
  console.error('getUserMedia error:', error)
})
