export default class Point {
    constructor (
        public x: number = 0, 
        public y: number = 0
    ) {}

    add (p: Point): Point {
        return new Point(this.x + p.x, this.y + p.y)
    }

    clone (): Point {
        return new Point(this.x, this.y)
    }

    dot (p: Point): number {
        return p.x * this.x + p.y * this.y
    }

    sub (p: Point): Point {
        return new Point(this.x - p.x, this.y - p.y)
    }

    mul (n: number): Point {
        return new Point(this.x * n, this.y * n)
    }
    
    inv (): Point {
        return this.mul(-1)
    }
    
    dist2 (p: Point): number {
        const dx = this.x - p.x
        const dy = this.y - p.y
        return dx * dx + dy * dy
    }
    
    norm (): Point {
        const length = Math.sqrt(this.len2())
        return new Point(this.x / length, this.y / length)
    }
    
    len2 (): number {
        return this.x * this.x + this.y * this.y
    }
    
    inBound (topleft: Point, bottomright: Point): boolean {
        return (
            topleft.x < this.x && this.x < bottomright.x &&
            topleft.y < this.y && this.y < bottomright.y
        )
    }
}