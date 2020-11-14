function startExample () {
  const audioContext = new window.AudioContext()

  // setup canvas
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight - 50
  document.body.appendChild(canvas)

  // setup audio element
  const audioElement = document.createElement('audio')
  audioElement.controls = true
  audioElement.autoplay = true
  audioElement.src = 'audio.mp3'
  document.body.appendChild(audioElement)

  // create source from html5 audio element
  const source = audioContext.createMediaElementSource(audioElement)

  // attach oscilloscope
  const scope = new Oscilloscope(source)

  // reconnect audio output to speakers
  source.connect(audioContext.destination)

  // customize drawing options
  const ctx = canvas.getContext('2d')
  ctx.lineWidth = 2
  ctx.strokeStyle = '#ffffff'

  // start default animation loop
  scope.animate(ctx)
}
