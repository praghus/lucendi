import Light from './light'
import { createCanvasBuffer, getBlackAlpha } from '../helpers'

export default class LineOfSight  {
    private _cache: CanvasBuffer
    private _ccache: CanvasBuffer

    public light: Light
    public objects: Array<Shape>

    constructor (options?: StringTMap<any>) {
        this.light = options.light || new Light()
        this.objects = options.objects || []
    }

    createCache (width: number, height: number) {
        this._cache = createCanvasBuffer('lc', width, height)
        this._ccache = createCanvasBuffer('lcc', width, height)
    }

    cast  (ctx: CanvasRenderingContext2D): void {
        const light = this.light
        const objects = this.objects
        const n = light.samples
        const c = this._ccache
        const bounds = light.bounds()

        c.ctx.clearRect(0, 0, c.width, c.height)
        c.ctx.fillStyle = getBlackAlpha(Math.round(100 / n) / 100)
        light.forEachSample((position) => {
            objects.map((object) => {
                if (object.contains(position)) {
                    c.ctx.fillRect(
                        bounds.topleft.x, 
                        bounds.topleft.y, 
                        bounds.bottomright.x - bounds.topleft.x, 
                        bounds.bottomright.y - bounds.topleft.y
                    )
                }
                object.cast(ctx, position, bounds)
            })
        })

        objects.map((object) => {
            let diffuse = object.diffuse === undefined ? 0.8 : object.diffuse
            diffuse *= light.diffuse
            c.ctx.fillStyle = getBlackAlpha(1 - diffuse)
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
        const ctx = this._cache.ctx
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
