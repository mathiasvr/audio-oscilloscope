function startExample () {
  // shim
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia

  const audioContext = new window.AudioContext()

  // setup canvas
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)

  // customize drawing options
  const ctx = canvas.getContext('2d')
  ctx.lineWidth = 2
  ctx.strokeStyle = '#ffffff'

  // get user microphone
  const constraints = { video: false, audio: true }
  navigator.getUserMedia(constraints, function (stream) {
    const source = audioContext.createMediaStreamSource(stream)

    // attach oscilloscope
    const scope = new Oscilloscope(source)

    // start default animation loop
    scope.animate(ctx)
  }, function (error) {
    console.error('getUserMedia error:', error)
  })
}
