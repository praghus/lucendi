import { CanvasBuffer, StringTMap, Bounds } from 'lucendi'
import { getUID, getRGBA, createCanvasBuffer } from '../helpers'
import { COLOR } from '../constants'
import Point from './boundaries/point'

export default class Light {
    private _gcache: CanvasBuffer
    private _vcache: CanvasBuffer
    private _gHash: string
    private _vHash: string

    public id: string
    public color: string
    public distance: number
    public diffuse: number
    public radius: number
    public samples: number
    public angle: number
    public position: Point
    public roughness: number

    constructor (options?: StringTMap<any>) {
        this.id = getUID()
        this.position = options.position || new Point()
        this.distance = options.distance || 100
        this.diffuse = options.diffuse || 0.8
        this.color = options.color || COLOR.LIGHT
        this.radius = options.radius || 0
        this.samples = options.samples || 1
        this.angle = options.angle || 0
        this.roughness = options.roughness || 0
    }

    private _getHashCache (): string {
        return [this.color, this.distance, this.diffuse, this.angle].toString()
    }

    private _getVisibleMaskCache (): CanvasBuffer {
        const d = Math.floor(this.distance * 1.4)
        const hash = `${d}`
        if (this._vHash !== hash) {
            const c = createCanvasBuffer('vm' + this.id, 2 * d, 2 * d)
            const g = c.ctx.createRadialGradient(d, d, 0, d, d, d)

            g.addColorStop(0, COLOR.BLACK1)
            g.addColorStop(1, COLOR.BLACK0)
            c.ctx.fillStyle = g
            c.ctx.fillRect(0, 0, c.width, c.height)

            this._vHash = hash
            this._vcache = c
        }
        return this._vcache
    }

    private _getGradientCache (center: Point): CanvasBuffer {
        const hash = this._getHashCache()
        if (this._gHash !== hash) {
            const d = Math.round(this.distance)
            const D = d * 2
            const c = createCanvasBuffer('gc' + this.id, D, D)
            const g = c.ctx.createRadialGradient(center.x, center.y, 0, d, d, d)

            g.addColorStop(Math.min(1, this.radius / this.distance), this.color)
            g.addColorStop(1, getRGBA(this.color, 0))
            c.ctx.fillStyle = g
            c.ctx.fillRect(0, 0, c.width, c.height)

            this._gHash = hash
            this._gcache = c
        }
        return this._gcache
    }

    center (): Point {
        return new Point(
            (1 - Math.cos(this.angle) * this.roughness) * this.distance,
            (1 + Math.sin(this.angle) * this.roughness) * this.distance
        )
    }

    orientationCenter (): Point {
        return new Point(Math.cos(this.angle), -Math.sin(this.angle)).mul(this.roughness * this.distance)
    }

    bounds (): Bounds {
        const { x, y } = this.orientationCenter()
        const { distance, position } = this
        return {
            p1: new Point(position.x + x - distance, position.y + y - distance),
            p2: new Point(position.x + x + distance, position.y + y + distance)
        }
    }

    mask (ctx: CanvasRenderingContext2D): void {
        const { x, y } = this.orientationCenter()
        const c = this._getVisibleMaskCache()
        ctx.drawImage(c.canvas, 
            Math.round(this.position.x + x - c.width / 2), 
            Math.round(this.position.y + y - c.height / 2)
        )
    }

    render (ctx: CanvasRenderingContext2D): void {
        const center = this.center()
        const c = this._getGradientCache(center)
        ctx.drawImage(c.canvas, 
            Math.round(this.position.x - center.x), 
            Math.round(this.position.y - center.y)
        )
    }

    forEachSample (callback: (data: any) => void): void {
        for (let s = 0; s < this.samples; ++s) {
            const a = s * (Math.PI * (3 - Math.sqrt(5)))
            const r = Math.sqrt(s / this.samples) * this.radius
            const delta = new Point(Math.cos(a) * r, Math.sin(a) * r)
            callback(this.position.add(delta))
        }
    }
}
