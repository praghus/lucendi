interface Dictionary<T> {
    [key: string]: T;
}

interface Vector {
    x: number
    y: number
}

interface Light {
    position: Vector
    distance: number
    diffuse: number
    mask(ctx: CanvasRenderingContext2D): void;
}