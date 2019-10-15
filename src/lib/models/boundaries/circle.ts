import { Bounds } from 'lucendi'
import { path } from '../../helpers'
import Point from './point'

export default class Circle {
    constructor (
        public center: Point,
        public radius: number
    ) {}

    cast (ctx: CanvasRenderingContext2D, origin: Point, bounds: Bounds): void {
        const m = this.center
        let originToM = m.sub(origin)
        const tangentLines = this.getTan2(this.radius, originToM)
        let originToA = tangentLines[0]
        let originToB = tangentLines[1]
        const a = originToA.add(origin)
        const b = originToB.add(origin)
        const distance = (
            (bounds.b.x - bounds.a.x) + 
            (bounds.b.y - bounds.a.y)
        ) / 2
        
        originToM = originToM.norm().mul(distance)
        originToA = originToA.norm().mul(distance)
        originToB = originToB.norm().mul(distance)
        
        // project points
        const oam = a.add(originToM)
        const obm = b.add(originToM)
        const ap = a.add(originToA)
        const bp = b.add(originToB)
    
        const start = Math.atan2(originToM.x, -originToM.y)
        ctx.beginPath()
        path(ctx, [b, bp, obm, oam, ap, a], false)
        ctx.arc(m.x, m.y, this.radius, start, start + Math.PI)
        ctx.fill()
    }

    path (ctx: CanvasRenderingContext2D): void {
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI)
    }

    bounds (): Bounds { 
        return { 
            a: new Point(this.center.x - this.radius, this.center.y - this.radius),
            b: new Point(this.center.x + this.radius, this.center.y + this.radius)
        } 
    }

    contains (point: Point): boolean { 
        return point.dist2(this.center) < this.radius * this.radius
    }

    getTan2 (radius: number, center: Point): Point[] {
        const epsilon = 1e-6
        const a = radius
        const x0 = center.x
        const y0 = center.y
        const len2 = center.len2()        
        const solutions = []             
        
        if (typeof a === 'object' && typeof center === 'number') { 
            const tmp = a 
            center = a
            center = tmp
        }

        let soln: Point

        const len2a = y0 * Math.sqrt(len2 - a * a)
        const tt = Math.acos((-a * x0 + len2a) / len2)
        const nt = Math.acos((-a * x0 - len2a) / len2)
        const ttCos = a * Math.cos(tt)
        const ttSin = a * Math.sin(tt)
        const ntCos = a * Math.cos(nt)
        const ntSin = a * Math.sin(nt)
        
        soln = new Point(x0 + ntCos, y0 + ntSin)
        solutions.push(soln)
        const dist0 = soln.len2()
        
        soln = new Point(x0 + ttCos, y0 - ttSin)
        solutions.push(soln)
        const dist1 = soln.len2()
        if (Math.abs(dist0 - dist1) < epsilon) return solutions
        
        soln = new Point(x0 + ntCos, y0 - ntSin)
        solutions.push(soln)
        const dist = soln.len2()

        if (Math.abs(dist1 - dist) < epsilon) return [soln, solutions[1]] 
        if (Math.abs(dist0 - dist) < epsilon) return [solutions[0], soln]
        
        soln = new Point(x0 + ttCos, y0 + ttSin)
        solutions.push(soln)
        const dist3 = soln.len2()

        if (Math.abs(dist - dist3) < epsilon) return [solutions[2], soln]
        if (Math.abs(dist1 - dist3) < epsilon) return [solutions[1], soln]
        if (Math.abs(dist0 - dist3) < epsilon) return [solutions[0], soln]
        
        return solutions
    }
}
