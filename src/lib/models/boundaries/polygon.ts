import { Bounds } from 'lucendi'
import { path } from '../../helpers'
import Point from './point'

export default class Polygon {
    constructor (
        public points: Point[] = []
    ) {}

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
            if (a.inBound(bounds.a, bounds.b)) {
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
            (bounds.b.x - bounds.a.x) +
            (bounds.b.y - bounds.a.y)
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
        const a = this.points[0].clone()
        const b = a.clone()
        this.points.map((p: Point): void => {
            if (p.x > b.x) b.x = p.x
            if (p.y > b.y) b.y = p.y
            if (p.x < a.x) a.x = p.x
            if (p.y < a.y) a.y = p.y
        })
        return { a, b }
    }

    contains (point: Point): boolean {
        const points = this.points
        const { x, y } = point

        let j = points.length - 1
        let oddNodes = false

        for (let i = 0; i < points.length; i++) {
            const [a, b] = [points[i], points[j]]
            if (
                (a.y < y && b.y >= y || b.y < y && a.y >= y) &&
                (a.x <= x || b.x <= x) &&
                (a.x + (y - a.y) / (b.y - a.y) * (b.x - a.x) < x)
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
