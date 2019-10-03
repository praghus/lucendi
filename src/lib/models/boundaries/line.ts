import { Bounds } from 'lucendi'
import Point from './point'
import Polygon from './polygon'

export default class Line extends Polygon {
    constructor (
        public a: Point,
        public b: Point,
    ) {
        super()
        this.points = [ this.a, this.b ]
    }

    bounds (): Bounds {
        return { 
            p1: this.a, 
            p2: this.b 
        }
    }
}
