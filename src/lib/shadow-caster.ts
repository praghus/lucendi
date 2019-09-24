// rename to shadow-caster

export default class ShadowCaster  {
    private buffer: CanvasRenderingContext2D
    private color: string
    private lights: Array<Light>

    constructor (lights: Array<Light> = [], color:string ='rgba(0,0,0,1)') {
        this.color = color
        this.lights = lights 
        this.buffer = document.createElement('canvas').getContext('2d')
    }

    calculate  (width: number, height: number) {
        const ctx = this.buffer
        ctx.save()
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = this.color
        ctx.fillRect(0, 0, width, height)
        ctx.globalCompositeOperation = 'destination-out'
        this.lights.map((light) => light.mask(ctx))
        ctx.restore()
    }

    render (ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.buffer.canvas, 0, 0)
    }
}
