import { clamp } from './clamp'

export class Tent {
  constructor(size, wrapper, canvas){
    this.wrapperRef = wrapper
    this.canvasRef = canvas
    this.size.width = size.width
    this.size.height = size.height
    this.wrapperSize.width = wrapper.offsetWidth
    this.wrapperSize.height = wrapper.offsetHeight
  }

  wrapperRef = null
  canvasRef = null

  wrapperSize = {
    width: 1000,
    height: 1000,
  }

  size = {
    width: 5000,
    height: 5000,
  }

  mousePointerX = null
  mousePointerY = null
  isDraging = false

  touchPointerX = null
  touchPointerY = null
  touchPointerX2 = null
  touchPointerY2 = null

  touches = {}

  ds = null
  isTouching = false

  state = {
    x: 0,
    y: 0,
    s: 1,
  }

  update = () => {
    this.canvasRef.style.transform = `translate3d(${this.state.x}px, ${this.state.y}px, 0px) scale(${this.state.s})`
  }

  setX = (value) => {
    this.state.x = clamp(value, -(this.size.width - this.wrapperSize.width - (this.size.width - (this.size.width * this.state.s))), 0)
    this.update()
  }

  setY = (value) => {
    this.state.y = clamp(value, -(this.size.height - this.wrapperSize.height - (this.size.height - (this.size.height * this.state.s))), 0)
    this.update()
  }

  setS = (value) => {
    this.state.s = clamp(value, 0.2, 10)
    this.update()
  }

  rescale = (originX, originY, newScale) => {
    const oldSize = this.size.width * this.state.s
    const newSize = this.size.width * newScale
    const diffSize = (oldSize - newSize)


      this.setS(clamp(newScale, 0.2, 10))
      this.setX(this.state.x + (diffSize * originX))
      this.setY(this.state.y + (diffSize * originY))

  }

  handleMouseDown = (e) => {
    this.mousePointerX = e.clientX
    this.mousePointerY = e.clientY
    this.isDraging = true
  }

  handleMouseUp = () => {
    this.mousePointerX = null
    this.mousePointerY = null
    this.isDraging = false
  }

  handleMouseLeave = () => {
    this.mousePointerX = null
    this.mousePointerY = null
    this.isDraging = false
  }

  handleMouseMove = (e) => {
    if (this.isDraging) {
      if (typeof this.mousePointerX !== 'number') {
        this.mousePointerX = e.clientX
        this.mousePointerY = e.clientY
      }

      this.setX(this.state.x - (this.mousePointerX - e.clientX))
      this.setY(this.state.y - (this.mousePointerY - e.clientY))

      this.mousePointerX = e.clientX
      this.mousePointerY = e.clientY
    }
  }

  handleTouchStart = (e) => {
    e.preventDefault()
    this.touchPointerX = e.touches[0].clientX
    this.touchPointerY = e.touches[0].clientY
    this.isTouching = true
  }

  handleTouchEnd = (e) => {
    e.preventDefault()
    this.touchPointerX = null
    this.touchPointerY = null
    this.isTouching = false
  }

  handleTouchCancel = (e) => {
    e.preventDefault()
    this.touchPointerX = null
    this.touchPointerY = null
    this.isTouching = false
  }

  handleTouchMove = (e) => {
    e.preventDefault()
    if (this.isTouching) {
      if (typeof this.touchPointerX !== 'number') {
        this.touchPointerX = e.touches[0].clientX
        this.touchPointerY = e.touches[0].clientY
      }

      if (!e.touches[1]?.clientX) {
        this.setX(this.state.x - (this.touchPointerX - e.touches[0].clientX))
        this.setY(this.state.y - (this.touchPointerY - e.touches[0].clientY))

        this.touchPointerX = e.touches[0].clientX
        this.touchPointerY = e.touches[0].clientY
      } else {
        const x1 = (e.touches[0].clientX)
        const y1 = (e.touches[0].clientY)
        const x2 = (e.touches[1].clientX)
        const y2 = (e.touches[1].clientY)
        const oX = -this.state.x + ((x1 + x2) / 2)
        const oY = -this.state.y + ((y1 + y2) / 2)
        const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

        const prev_x1 = this.touches.x1
        const prev_y1 = this.touches.y1
        const prev_x2 = this.touches.x2
        const prev_y2 = this.touches.y2

        const prev_d = Math.sqrt(Math.pow(prev_x2 - prev_x1, 2) + Math.pow(prev_y2 - prev_y1, 2))
        const originX = (oX / this.size.width) / this.state.s
        const originY = (oY / this.size.height) / this.state.s

        if (Math.abs(d - prev_d) > 1) {
          if (d > prev_d){
            this.rescale(originX, originY, this.state.s + 0.01)
          } else {
            this.rescale(originX, originY, this.state.s - 0.01)
          }
        }

        this.touches = { x1, y1, x2, y2 }
      }
    }
  }

  wheelHanler = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.ctrlKey) {
      const left = -this.state.x + e.clientX
      const top = -this.state.y + e.clientY;
      const originX = (left / this.size.width) / this.state.s
      const originY = (top / this.size.height) / this.state.s

      this.rescale(originX, originY, this.state.s - (e.deltaY * 0.01))
    } else {
      this.setX(this.state.x - e.deltaX)
      this.setY(this.state.y - e.deltaY)
    }
  }

  init = () => {
    this.canvasRef.addEventListener("mousedown", this.handleMouseDown)
    this.canvasRef.addEventListener("mouseup", this.handleMouseUp)
    this.canvasRef.addEventListener("mouseleave", this.handleMouseLeave)
    this.canvasRef.addEventListener("mousemove", this.handleMouseMove)

    this.canvasRef.addEventListener("touchstart", this.handleTouchStart)
    this.canvasRef.addEventListener("touchcancel", this.handleTouchCancel)
    this.canvasRef.addEventListener("touchend", this.handleTouchEnd)
    this.canvasRef.addEventListener("touchmove", this.handleTouchMove)

    this.canvasRef.addEventListener("wheel", this.wheelHanler)

    this.setX(-(this.size.width / 2 - this.wrapperSize.width / 2))
    this.setY(-(this.size.height / 2 - this.wrapperSize.height / 2))
  }
}
