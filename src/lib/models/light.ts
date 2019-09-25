import Vector from './vector'
import { COLOR } from '../constants'
import { getUID, getRGBA, createCanvasBuffer } from '../helpers'

export default class Light {
    private _gcacheHash: string
    private _mcacheHash: string
    private _gcache: CanvasBuffer
    private _mcache: CanvasBuffer

    public id: string
    public position: Vector
    public centerPos: Vector
    public diffuse: number
    public distance: number
    public color: string
    public radius: number
    public samples: number
    public angle: number
    public roughness: number

    constructor (options?: StringTMap<any>) {
        this.id = getUID()
        this.position = options.position || new Vector(),
        this.distance = options.distance || 100,
        this.diffuse = options.diffuse || 0.8
        this.color = options.color || COLOR.LIGHT,
        this.radius = options.radius || 0,
        this.samples = options.samples || 1,
        this.angle = options.angle || 0,
        this.roughness = options.roughness || 0
        this.centerPos = new Vector(
            Math.cos(this.angle), -Math.sin(this.angle)
        ).mul(this.roughness * this.distance)
    }

    _getHashCache (): string {
        return `${this.color},${this.distance},${this.diffuse},${this.angle},${this.roughness}`
    }

    _getGradientCache (center: Vector): CanvasBuffer {
        const d = Math.round(this.distance)
        const h = this._getHashCache()
        if (this._gcacheHash !== h) {
            const c = createCanvasBuffer(this.id, 2 * d, 2 * d)
            const g = c.ctx.createRadialGradient(center.x, center.y, 0, d, d, d)
            g.addColorStop(Math.min(1, this.radius / this.distance), this.color)
            g.addColorStop(1, getRGBA(this.color, 0))
            c.ctx.fillStyle = g
            c.ctx.fillRect(0, 0, c.width, c.height)
            
            this._gcache = c
            this._gcacheHash = h
        }

        return this._gcache
    }

    _getMaskCache () {
        const d = Math.floor(this.distance * 1.4)
        const h = `${d}`
        if (this._mcacheHash !== h) {
            const c = createCanvasBuffer(this.id, 2 * d, 2 * d)
            const g = c.ctx.createRadialGradient(d, d, 0, d, d, d)
            g.addColorStop(0, COLOR.BLACK0)
            g.addColorStop(1, COLOR.BLACK0)
            c.ctx.fillStyle = g
            c.ctx.fillRect(0, 0, c.width, c.height)

            this._mcache = c
            this._mcacheHash = h
        }
        return this._mcache
    }


    center (): Vector {
        const { angle, roughness, distance } = this
        return new Vector(
            (1 - Math.cos(angle) * roughness) * distance,
            (1 + Math.sin(angle) * roughness) * distance
        )
    }

    bounds (): Bounds {
        const { position: { x, y }, centerPos, distance } = this
        return {
            topleft: new Vector(x + centerPos.x - distance, y + centerPos.y - distance),
            bottomright: new Vector(x + centerPos.x + distance, y + centerPos.y + distance)
        }
    }

    mask (ctx: CanvasRenderingContext2D): void {
        const { position: { x, y }, centerPos } = this
        const c = this._getMaskCache()
        ctx.drawImage(c.canvas,
            Math.round(x + centerPos.x - c.width / 2),
            Math.round(y + centerPos.y - c.height / 2)
        )
    }

    render (ctx: CanvasRenderingContext2D): void {
        const center = this.center()
        const { position: { x, y } } = this
        const c = this._getGradientCache(center)
        ctx.drawImage(c.canvas,
            Math.round(x - center.x),
            Math.round(y - center.y)
        )
    }

    forEachSample (f: (data: any) => void): void {
        for (let s = 0; s < this.samples; ++s) {
            const a = s * (Math.PI * (3 - Math.sqrt(5)))
            const r = Math.sqrt(s / this.samples) * this.radius
            const delta = new Vector(Math.cos(a) * r, Math.sin(a) * r)
            f(this.position.add(delta))
        }
    }
}
