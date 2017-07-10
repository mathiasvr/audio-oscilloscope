class Oscilloscope

  constructor: (source, options = { }) ->
    return new Oscilloscope source, options unless this instanceof Oscilloscope
    
    @drawRequest = 0

    unless source instanceof AudioNode
      throw new Error "Signal must be an AudioNode"

    if source instanceof AnalyserNode
      @analyser = source
    else
      @analyser = source.context.createAnalyser()
      source.connect @analyser

    @analyser.fftSize = options.fftSize if options.fftSize;  # range 32 to 32768

    @timeDomain = new Uint8Array(@analyser.frequencyBinCount)
    
    console.log('fft', @analyser.fftSize)
    console.log('bincount', @analyser.frequencyBinCount)


  # todo: make auto start/stop (after babel)
  # begin default signal animation
  animate: ->
    return if @drawRequest
    @drawRequest = window.requestAnimationFrame @_drawSignal

  # todo: stop signal animation
  stop: ->
    cancelAnimationFrame @drawRequest
    @drawRequest = 0
    #@drawContext.clearRect 0, 0, @canvas.width, @canvas.height

  # draw signal animation
  draw: (ctx, x0, y0, width, height) =>
    # TODO: maybe cache values
    x0 = x0 || 0
    y0 = y0 || 0
    width = width || (ctx.canvas.width - x0)
    height = height || (ctx.canvas.height - y0)

    step = width / @timeDomain.length

    @analyser.getByteTimeDomainData @timeDomain

    ctx.beginPath()
    # drawing loop (skipping every second record)
    for value, i in @timeDomain by 2
      percent = value / 256
      x = x0 + i * step
      y = y0 + height * percent
      ctx.lineTo x, y

    ctx.stroke()

module.exports = Oscilloscope
