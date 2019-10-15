import { CanvasBuffer, Shape } from 'lucendi'
import { createCanvasBuffer, getBlackAlpha } from '../helpers'
import Light from './light'

export default class LineOfSight  {
    private _cache: CanvasBuffer
    private _ccache: CanvasBuffer
    
    constructor (
        public light: Light, 
        public boundaries: Shape[]  
    ) {}

    createCache (width: number, height: number): void {
        this._cache = createCanvasBuffer('lc', width, height)
        this._ccache = createCanvasBuffer('lcc', width, height)
    }

    cast (ctx: CanvasRenderingContext2D): void {
        const { light, boundaries } = this
        const { a, b } = light.bounds()
        const n = light.samples
        const c = this._ccache

        c.ctx.clearRect(0, 0, c.width, c.height)
        c.ctx.fillStyle = getBlackAlpha(Math.round(100 / n) / 100)
        light.forEachSample((position) => {
            for (const object of boundaries) {
                if (object.contains(position)) {
                    c.ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y)
                }
                object.cast(ctx, position, light.bounds())
            }
        })
        for (const object of boundaries) {
            c.ctx.fillStyle = getBlackAlpha(1)
            c.ctx.beginPath()
            object.path(c.ctx)
            c.ctx.fill()
        }
        ctx.drawImage(c.canvas, 0, 0)
    }

    buffer (width: number, height: number): void {
        if (!this._cache || this._cache.width !== width || this._cache.height !== height) { 
            this.createCache(width, height) 
        }
        const { ctx } = this._cache
        ctx.save()
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        this.light.render(ctx)
        ctx.globalCompositeOperation = 'destination-out'
        this.cast(ctx)
        ctx.restore()
    }

    render (ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this._cache.canvas, 0, 0)
    }
}
