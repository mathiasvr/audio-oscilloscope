export default class Oscilloscope {
  constructor (source, options = {}) {
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
    this.timeDomain = new Uint8Array(this.analyser.fftSize)
    this.drawRequest = 0
  }

  // begin default signal animation
  animate (ctx, x0, y0, width, height) {
    if (this.drawRequest) {
      throw new Error('Oscilloscope animation is already running')
    }
    this.ctx = ctx
    const drawLoop = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      this.draw(ctx, x0, y0, width, height)
      this.drawRequest = window.requestAnimationFrame(drawLoop)
    }
    drawLoop()
  }

  // stop default signal animation
  stop () {
    if (this.drawRequest) {
      window.cancelAnimationFrame(this.drawRequest)
      this.drawRequest = 0
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    }
  }

  // draw signal
  draw (ctx, x0 = 0, y0 = 0, width = ctx.canvas.width - x0, height = ctx.canvas.height - y0) {
    this.analyser.getByteTimeDomainData(this.timeDomain)
    const step = width / this.timeDomain.length

    ctx.beginPath()
    // drawing loop (skipping every second record)
    for (let i = 0; i < this.timeDomain.length; i += 2) {
      const percent = this.timeDomain[i] / 256
      const x = x0 + (i * step)
      const y = y0 + (height * percent)
      ctx.lineTo(x, y)
    }

    ctx.stroke()
  }
}
