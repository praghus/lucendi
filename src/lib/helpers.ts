import { Point, CanvasBuffer } from 'lucendi'

export const noop = Function.prototype

export const createBuffer = (): CanvasRenderingContext2D => document.createElement('canvas').getContext('2d')

export const getUID = (): string => `_${Math.random().toString(36).substr(2, 9)}`

export const getBlackAlpha = (alpha: number): string => `rgba(0,0,0,${alpha})`

export function path (
    ctx: CanvasRenderingContext2D, 
    points: Array<Point>, 
    join = true
): void {
    const p = points[0]
    ctx.moveTo(p.x, p.y)
    points.forEach(({x, y}) => ctx.lineTo(x, y))
    join && ctx.lineTo(p.x, p.y)
}

export function createCanvasBuffer (
    uid: string, 
    width: number,
    height: number
): CanvasBuffer {
    let canvas = document.getElementById(uid) as HTMLCanvasElement
    if (canvas === null) {
        canvas = document.createElement('canvas')
        canvas.id = uid
        canvas.width = width
        canvas.height = height
        canvas.style.display = 'none'
        document.body.appendChild(canvas)
    }

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    canvas.width = width
    canvas.height = height

    return { canvas, ctx, width, height }
}

export const getRGBA = (function () {
    const ctx = createBuffer()
    return (color: string, alpha: number) => {
        ctx.clearRect(0, 0, 1, 1)
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 1, 1)
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
        return `rgba(${r},${g},${b},${alpha})`
    }
}())