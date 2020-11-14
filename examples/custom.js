function startExample () {
  const audioContext = new window.AudioContext()

  // setup canvas
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)

  // setup audio element
  const audioElement = document.createElement('audio')
  audioElement.autoplay = true
  audioElement.src = 'audio.mp3'
  document.body.appendChild(audioElement)

  // create source from html5 audio element
  const source = audioContext.createMediaElementSource(audioElement)

  // attach oscilloscope
  const scope = new Oscilloscope(source)

  // reconnect audio output to speakers
  source.connect(audioContext.destination)

  const ctx = canvas.getContext('2d')
  ctx.lineWidth = 3
  ctx.shadowBlur = 4
  ctx.shadowColor = 'white'

  // custom animation loop
  function drawLoop () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

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
    scope.draw(ctx, 0, centerY, undefined, centerY)

    window.requestAnimationFrame(drawLoop)
  }

  drawLoop()
}
