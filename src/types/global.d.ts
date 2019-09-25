interface StringTMap<T> {
    [key: string]: T;
}

interface NumberTMap<T> {
    [key: number]: T;
}

interface CanvasBuffer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
}

interface Bounds {
    topleft: Vector;
    bottomright: Vector;
}

interface Vector {
    x: number;
    y: number;
    add(v: Vector): Vector;
    copy(): Vector;
    dist2(v: Vector): number;
    dot(v: Vector): number;
    inBound(topleft: Vector, bottomright: Vector): boolean;
    inv(): Vector;
    length2(): number;
    mul(n: number): Vector;
    normalize(): Vector;
    sub(v: Vector): Vector;
}

interface Light {
    id: string;
    position: Vector;
    centerPos: Vector;
    diffuse: number;
    distance: number;
    color: string;
    radius: number;
    samples: number;
    angle: number;
    roughness: number;
    mask(ctx: CanvasRenderingContext2D): void;
}

interface Shape {    
    center?: Vector;
    diffuse?: number;
    points?: Array<Vector>;
    radius?: number;
    cast(ctx: CanvasRenderingContext2D, position: Vector, bounds: Bounds): void;
    contains(point: Vector): boolean;
    path(ctx: CanvasRenderingContext2D): void;
}