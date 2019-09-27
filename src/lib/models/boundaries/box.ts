import Point from './point'
import Polygon from './polygon'

export default class Box extends Polygon {
    constructor (
        public x: number,
        public y: number,
        public width: number,
        public height: number,
    ) {
        super()
        this.points = [
            new Point(x, y),
            new Point(x + width, y),
            new Point(x + width, y + height),
            new Point(x, y + height)
        ]
    }
}
