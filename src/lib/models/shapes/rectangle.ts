import Vector from '../vector'
import Polygon from './polygon'

export default class RectangleObject extends Polygon {
    public points: Array<Vector>
    public topleft: Vector
    public bottomright: Vector

    constructor (options?: StringTMap<any>) {
        super()
        this.topleft = options.topleft || new Vector(),
        this.bottomright = options.bottomright || new Vector()
    }

    syncFromTopleftBottomright (): void {
        this.points = [
            this.topleft, new Vector(this.bottomright.x, this.topleft.y),
            this.bottomright, new Vector(this.topleft.x, this.bottomright.y)
        ]
    }

    fill (ctx: CanvasRenderingContext2D): void {
        const x = this.points[0].x
        const y = this.points[0].y
        ctx.rect(x, y, this.points[2].x - x, this.points[2].y - y)
    }
}
