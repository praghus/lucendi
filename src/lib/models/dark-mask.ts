import { CanvasBuffer, Light } from 'lucendi'
import { createCanvasBuffer } from '../helpers'
import { COLOR } from '../constants'

export default class DarkMask {
    private _cache: CanvasBuffer

    constructor (
        public lights: Light[], 
        public color: string = COLOR.BLACK1    
    ) {}

    buffer (width: number, height: number): void {
        if (!this._cache || this._cache.width !== width || this._cache.height !== height) { 
            this._cache = createCanvasBuffer('dm', width, height)
        }
        const { ctx } = this._cache
        ctx.save()
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = this.color
        ctx.fillRect(0, 0, width, height)
        ctx.globalCompositeOperation = 'destination-out'
        for (const light of this.lights) {
            light.mask(ctx)
        }
        ctx.restore()
    }

    render (ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this._cache.canvas, 0, 0)
    }
}
