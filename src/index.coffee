debug = require("debug")("oscilloscope")

class Oscilloscope

  # TODO: resize canvas without loosing context options.
  constructor: (@canvas, options = { stroke: 2, glow: 0.0, buffer: 2048 }) ->
    return new Oscilloscope @canvas, options unless this instanceof Oscilloscope

    @signals = []
    @drawRequest = 0

    # reusable time-domain buffer (waveform data)
    @timeDomain = new Uint8Array(options.buffer) # range 32 to 2048

    # setup canvas drawing context
    @drawContext = @canvas.getContext("2d")

    @drawContext.lineWidth = options.stroke
    #TODO: can we just multiply right now.
    @drawContext.shadowBlur = options.glow * 100

    # TODO: we may want to avoid this flip in the future.
    # flip the context to mimic a regular cartesian coordinate system
    @drawContext.translate 0, @canvas.height
    @drawContext.scale 1, -1

  # add source signal to the oscilloscope
  addSignal: (source, color) ->
    unless source instanceof AudioNode
      throw new Error "Signal must be an AudioNode"

    if source instanceof AnalyserNode
      debug "add signal analyser"
      analyser = source
    else
      debug "add signal source"
      analyser = source.context.createAnalyser()
      source.connect analyser

    # TODO: existing analysers will get fftSize overidden?
    analyser.fftSize = @timeDomain.length

    @signals.push
      analyser: analyser
      color: color or "#ffffff"

    # auto-start when adding the first signal
    if @signals.length == 1
      @start()

  # TODO: implement this i guess. (auto-stop?)
  removeSignal: (analyser) ->
    debug "remove signal"
    throw new Error "Not implemented."

  # begin signal animation
  start: ->
    return if @drawRequest
    debug "start animation"
    @drawRequest = window.requestAnimationFrame @_drawSignal

  # stop signal animation
  stop: ->
    debug "stop animation"
    cancelAnimationFrame @drawRequest
    @drawRequest = 0
    @drawContext.clearRect 0, 0, @canvas.width, @canvas.height

  # draw signal animation
  _drawSignal: =>
    @drawContext.clearRect 0, 0, @canvas.width, @canvas.height

    step = @canvas.width / @timeDomain.length
    scopeHeight = @canvas.height / @signals.length

    for signal, index in @signals
      @drawContext.beginPath()

      signal.analyser.getByteTimeDomainData @timeDomain

      # drawing loop (skipping every second record)
      for value, i in @timeDomain by 2
        # TODO: recheck this (255/256) and that
        percent = value / 255
        x = i * step
        y = (scopeHeight * percent) + (scopeHeight * index)
        @drawContext.lineTo x, y

      @drawContext.strokeStyle = signal.color
      @drawContext.shadowColor = signal.color
      @drawContext.stroke()

    @drawRequest = window.requestAnimationFrame @_drawSignal

module.exports = Oscilloscope
