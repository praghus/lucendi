import Point from './point'
import { path } from '../../helpers'

export default class Polygon {
    public points: Array<Point>
    public diffuse: number

    constructor (options?: StringTMap<any>) {
        this.diffuse = options.diffuse || 0.8
        this.points = options.points || []
    }

    _forEachVisibleEdges (
        origin: Point,
        bounds: Bounds,
        callback: (
            a: Point,
            b: Point,
            originToA: Point,
            originToB: Point,
            aToB: Point
        ) => void
    ) {
        let a: Point = this.points[this.points.length - 1]
        let b: Point
        for (let p = 0; p < this.points.length; ++p, a = b) {
            b = this.points[p]
            if (a.inBound(bounds.p1, bounds.p2)) {
                const originToA = a.sub(origin)
                const originToB = b.sub(origin)
                const aToB = b.sub(a)
                const normal = new Point(aToB.y, -aToB.x)
                if (normal.dot(originToA) < 0) {
                    callback(a, b, originToA, originToB, aToB)
                }
            }
        }
    }

    cast (ctx: CanvasRenderingContext2D, origin: Point, bounds: Bounds): void {
        const distance = (
            (bounds.p2.x - bounds.p1.x) +
            (bounds.p2.y - bounds.p1.y)
        ) / 2

        this._forEachVisibleEdges(origin, bounds, (
            a: Point,
            b: Point,
            originToA: Point,
            originToB: Point,
            aToB: Point
        ) => {
            let m: Point
            const t = originToA.inv().dot(aToB) / aToB.len2()

            if (t < 0) m = a
            else if (t > 1) m = b
            else m = a.add(aToB.mul(t))

            let originToM = m.sub(origin)

            originToM = originToM.norm().mul(distance)
            originToA = originToA.norm().mul(distance)
            originToB = originToB.norm().mul(distance)

            const oam = a.add(originToM)
            const obm = b.add(originToM)
            const ap = a.add(originToA)
            const bp = b.add(originToB)

            ctx.beginPath()
            path(ctx, [a, b, bp, obm, oam, ap])
            ctx.fill()
        })
    }

    bounds (): Bounds {
        const p1 = this.points[0].clone()
        const p2 = p1.clone()
        this.points.map((p: Point): void => {
            if (p.x > p2.x) p2.x = p.x
            if (p.y > p2.y) p2.y = p.y
            if (p.x < p1.x) p1.x = p.x
            if (p.y < p1.y) p1.y = p.y
        })
        return { p1, p2 }
    }

    contains (point: Point): boolean {
        const points = this.points
        const { x, y } = point

        let j = points.length - 1
        let oddNodes = false

        for (let i = 0; i < points.length; i++) {
            const [p1, p2] = [points[i], points[j]]
            if (
                (p1.y < y && p2.y >= y || p2.y < y && p1.y >= y) &&
                (p1.x <= x || p2.x <= x) &&
                (p1.x + (y - p1.y) / (p2.y - p1.y) * (p2.x - p1.x) < x)
            ) {
                oddNodes = !oddNodes
            }
            j = i
        }
        return oddNodes
    }

    path (ctx: CanvasRenderingContext2D): void {
        path(ctx, this.points)
    }
}
