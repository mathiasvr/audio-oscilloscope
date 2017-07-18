class Oscilloscope

  constructor: (source, options = { }) ->
    return new Oscilloscope source, options unless this instanceof Oscilloscope

    unless source instanceof AudioNode
      throw new Error "Signal must be an AudioNode"

    if source instanceof AnalyserNode
      @analyser = source
    else
      @analyser = source.context.createAnalyser()
      source.connect @analyser

    @analyser.fftSize = options.fftSize if options.fftSize
    @timeDomain = new Uint8Array(@analyser.frequencyBinCount)
    @drawRequest = 0

  # begin default signal animation
  animate: (@ctx, x0, y0, width, height) =>
    return if @drawRequest
    do drawLoop = =>
      @ctx.clearRect 0, 0, @ctx.canvas.width, @ctx.canvas.height
      @draw @ctx, x0, y0, width, height
      @drawRequest = window.requestAnimationFrame drawLoop

  # stop default signal animation
  stop: =>
    cancelAnimationFrame @drawRequest
    @drawRequest = 0
    @ctx.clearRect 0, 0, @ctx.canvas.width, @ctx.canvas.height

  # draw signal
  draw: (ctx, x0, y0, width, height) =>
    # TODO: maybe cache values
    x0 = x0 || 0
    y0 = y0 || 0
    width = width || (ctx.canvas.width - x0)
    height = height || (ctx.canvas.height - y0)

    @analyser.getByteTimeDomainData @timeDomain
    step = width / @timeDomain.length

    ctx.beginPath()
    # drawing loop (skipping every second record)
    for value, i in @timeDomain by 2
      percent = value / 256
      x = x0 + i * step
      y = y0 + height * percent
      ctx.lineTo x, y

    ctx.stroke()

module.exports = Oscilloscope
