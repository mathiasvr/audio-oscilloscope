var audioContext = new window.AudioContext()

// setup canvas
var canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)

// setup audio element
var audioElement = document.createElement('audio')
audioElement.autoplay = true
audioElement.src = 'audio.mp3'
document.body.appendChild(audioElement)

// create source from html5 audio element
var source = audioContext.createMediaElementSource(audioElement)

// attach oscilloscope
var scope = new Oscilloscope(source)

// reconnect audio output to speakers
source.connect(audioContext.destination)

// todo make 'start' func in osc for this default stuff
var ctx = canvas.getContext('2d')
ctx.lineWidth = 3
ctx.shadowBlur = 4
ctx.shadowColor = 'white'

// custom animation loop
function drawLoop () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  var centerX = canvas.width / 2
  var centerY = canvas.height / 2

  // draw circle
  ctx.beginPath()
  ctx.arc(centerX, centerY, 100, 0, 2 * Math.PI, false)
  ctx.fillStyle = 'yellow'
  ctx.fill()

  // draw three oscilloscopes in different positions and colors
  ctx.strokeStyle = 'lime'
  scope.draw(ctx, 0, 0, centerX, centerY)

  ctx.strokeStyle = 'cyan'
  scope.draw(ctx, centerX, 0, centerX, centerY)

  ctx.strokeStyle = 'red'
  scope.draw(ctx, 0, centerY, null, centerY)

  window.requestAnimationFrame(drawLoop)
}

drawLoop()
