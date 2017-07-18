var Oscilloscope = require('..')

var audioContext = new window.AudioContext()

// setup canvas
var canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight - 50
document.body.appendChild(canvas)

// setup audio element
var audioElement = document.createElement('audio')
audioElement.controls = true
audioElement.autoplay = true
audioElement.src = 'loading.mp3'
document.body.appendChild(audioElement)

// create source from html5 audio element
var source = audioContext.createMediaElementSource(audioElement)

// attach oscilloscope
var scope = new Oscilloscope(source)

// reconnect audio output to speakers
source.connect(audioContext.destination)

// customize drawing options
var ctx = canvas.getContext('2d')
ctx.lineWidth = 2
//ctx.strokeStyle = '#ffffff'

// start default animation loop
scope.animate(ctx)
