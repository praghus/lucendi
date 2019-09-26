import Vector from '../vector'
import { path } from '../../helpers'

export default class PolygonObject {
    public points: Array<Vector>

    constructor (options?: StringTMap<any>) {
        this.points = options.points || []
    }
    
    _forEachVisibleEdges (
        origin: Vector, 
        bounds: Bounds, 
        callback: (
            a: Vector, 
            b: Vector, 
            originToA: Vector, 
            originToB: Vector, 
            aToB: Vector
        ) => void
    ) {
        let a: Vector = this.points[this.points.length - 1]
        let b: Vector        
        for (let p = 0; p < this.points.length; ++p, a = b) {
            b = this.points[p]
            if (a.inBound(bounds.topleft, bounds.bottomright)) {
                const originToA = a.sub(origin)
                const originToB = b.sub(origin)
                const aToB = b.sub(a)
                const normal = new Vector(aToB.y, -aToB.x)
                if (normal.dot(originToA) < 0) {
                    callback(a, b, originToA, originToB, aToB)
                }
            }
        }
    }    
    
    cast (ctx: CanvasRenderingContext2D, origin: Vector, bounds: Bounds): void {
        const distance = (
            (bounds.bottomright.x - bounds.topleft.x) + 
            (bounds.bottomright.y - bounds.topleft.y)
        ) / 2

        this._forEachVisibleEdges(origin, bounds, (
            a: Vector, 
            b: Vector, 
            originToA: Vector, 
            originToB: Vector, 
            aToB: Vector
        ) => {
            let m: Vector 
            const t = originToA.inv().dot(aToB) / aToB.length2()
            
            if (t < 0) m = a            
            else if (t > 1) m = b
            else m = a.add(aToB.mul(t)) 
            
            let originToM = m.sub(origin)

            originToM = originToM.normalize().mul(distance)
            originToA = originToA.normalize().mul(distance)
            originToB = originToB.normalize().mul(distance)

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
        const topleft = this.points[0].copy()
        const bottomright = topleft.copy()
        this.points.map((p: Vector): void => {
            if (p.x > bottomright.x) bottomright.x = p.x 
            if (p.y > bottomright.y) bottomright.y = p.y 
            if (p.x < topleft.x) topleft.x = p.x 
            if (p.y < topleft.y) topleft.y = p.y 
        })
        return { 
            topleft: topleft, 
            bottomright: bottomright 
        }
    }

    contains (point: Vector): boolean {
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
