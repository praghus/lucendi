
import { Vector } from './vector'

export const path = (ctx: CanvasRenderingContext2D , points: Array<Vector>, dontJoinLast) => {
    let p = points[0]
    ctx.moveTo(p.x, p.y)
    for (let i = 1; i < points.length; ++i) {
        p = points[i]
        ctx.lineTo(p.x, p.y)
    }
    if (!dontJoinLast && points.length > 2) {
        p = points[0]
        ctx.lineTo(p.x, p.y)
    }
}

export function createCanvasAnd2dContext (id, w, h) {
    const iid = 'illujs_' + id
    let canvas: any = document.getElementById(iid)

    if (canvas === null) {
        canvas = document.createElement('canvas')
        canvas.id = iid
        canvas.width = w
        canvas.height = h
        canvas.style.display = 'none'
        document.body.appendChild(canvas)
    }

    var ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    canvas.width = w
    canvas.height = h

    return { canvas: canvas, ctx: ctx, w: w, h: h }
}

export const getRGBA = (function () {
    var canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    var ctx = canvas.getContext('2d')

    return function (color, alpha) {
        ctx.clearRect(0, 0, 1, 1)
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 1, 1)
        var d = ctx.getImageData(0, 0, 1, 1).data
        return 'rgba(' + [ d[0], d[1], d[2], alpha ] + ')'
    }
}())