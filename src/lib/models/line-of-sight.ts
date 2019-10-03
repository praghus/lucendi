import { CanvasBuffer, Shape, StringTMap } from 'lucendi'
import { createCanvasBuffer, getBlackAlpha } from '../helpers'
import Light from './light'

export default class LineOfSight  {
    private _cache: CanvasBuffer
    private _ccache: CanvasBuffer

    public light: Light
    public lightmask: Shape[] 
    
    constructor (options?: StringTMap<any>) {
        this.light = options.light || new Light()
        this.lightmask = options.lightmask || []
    }

    createCache (width: number, height: number): void {
        this._cache = createCanvasBuffer('lc', width, height)
        this._ccache = createCanvasBuffer('lcc', width, height)
    }

    cast (ctx: CanvasRenderingContext2D): void {
        const { light, lightmask } = this
        const n = light.samples
        const c = this._ccache
        const bounds = light.bounds()

        c.ctx.clearRect(0, 0, c.width, c.height)
        c.ctx.fillStyle = getBlackAlpha(Math.round(100 / n) / 100)
        light.forEachSample((position) => {
            lightmask.map((object) => {
                if (object.contains(position)) {
                    c.ctx.fillRect(
                        bounds.p1.x, 
                        bounds.p1.y, 
                        bounds.p2.x - bounds.p1.x, 
                        bounds.p2.y - bounds.p1.y
                    )
                }
                object.cast(ctx, position, bounds)
            })
        })

        lightmask.map((object) => {
            object.diffuse *= light.diffuse
            c.ctx.fillStyle = getBlackAlpha(1 - object.diffuse)
            c.ctx.beginPath()
            object.path(c.ctx)
            c.ctx.fill()
        })
        
        ctx.drawImage(c.canvas, 0, 0)
    }

    calculate (width: number, height: number): void {
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
