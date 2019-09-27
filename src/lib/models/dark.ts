import { createCanvasBuffer } from '../helpers'
import { COLOR } from '../constants'

export default class Dark {
    private _cache: CanvasBuffer

    public lights: Array<Light> 
    public color: string

    constructor (options?: StringTMap<any>) {
        this.color = options.color || COLOR.BLACK1
        this.lights = options.lights || []
    }

    calculate (width: number, height: number): void {
        if (!this._cache || this._cache.width !== width || this._cache.height !== height) { 
            this._cache = createCanvasBuffer('dm', width, height)
        }
        const { ctx } = this._cache
        ctx.save()
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = this.color
        ctx.fillRect(0, 0, width, height)
        ctx.globalCompositeOperation = 'destination-out'
        this.lights.map((light) => light.mask(ctx))
        ctx.restore()
    }

    render (ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this._cache.canvas, 0, 0)
    }
}
