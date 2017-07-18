export default class Oscilloscope {
  constructor (source, options = { }) {
    if (!(source instanceof window.AudioNode)) {
      throw new Error('Oscilloscope source must be an AudioNode')
    }

    if (source instanceof window.AnalyserNode) {
      this.analyser = source
    } else {
      this.analyser = source.context.createAnalyser()
      source.connect(this.analyser)
    }

    if (options.fftSize) { this.analyser.fftSize = options.fftSize }
    this.timeDomain = new Uint8Array(this.analyser.frequencyBinCount)
    this.drawRequest = 0
  }

  // begin default signal animation
  animate (ctx, x0, y0, width, height) {
    if (this.drawRequest) throw new Error('Oscilloscope animation is already running')
    this.ctx = ctx
    let drawLoop = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      this.draw(ctx, x0, y0, width, height)
      this.drawRequest = window.requestAnimationFrame(drawLoop)
    }
    drawLoop()
  }

  // stop default signal animation
  stop () {
    window.cancelAnimationFrame(this.drawRequest)
    this.drawRequest = 0
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  // draw signal
  draw (ctx, x0, y0, width, height) {
    // TODO: maybe cache values
    x0 = x0 || 0
    y0 = y0 || 0
    width = width || (ctx.canvas.width - x0)
    height = height || (ctx.canvas.height - y0)

    this.analyser.getByteTimeDomainData(this.timeDomain)
    let step = width / this.timeDomain.length

    ctx.beginPath()
    // drawing loop (skipping every second record)
    for (let i = 0; i < this.timeDomain.length; i += 2) {
      let percent = this.timeDomain[i] / 256
      let x = x0 + (i * step)
      let y = y0 + (height * percent)
      ctx.lineTo(x, y)
    }

    ctx.stroke()
  }
}
