export default class Vector {
    public x: number
    public y: number

    constructor (x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    add (v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y)
    }

    copy (): Vector {
        return new Vector(this.x, this.y)
    }

    dot (v: Vector): number {
        return v.x * this.x + v.y * this.y
    }

    sub (v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y)
    }

    mul (n: number): Vector {
        return new Vector(this.x * n, this.y * n)
    }
    
    inv (): Vector {
        return this.mul(-1)
    }
    
    dist2 (v: Vector): number {
        const dx = this.x - v.x
        const dy = this.y - v.y
        return dx * dx + dy * dy
    }
    
    normalize (): Vector {
        const length = Math.sqrt(this.length2())
        return new Vector(this.x / length, this.y / length)
    }
    
    length2 (): number {
        return this.x * this.x + this.y * this.y
    }
    
    inBound (topleft: Vector, bottomright: Vector): boolean {
        return (
            topleft.x < this.x && this.x < bottomright.x &&
            topleft.y < this.y && this.y < bottomright.y
        )
    }
}