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
    p1: Point;
    p2: Point;
}

interface Point {
    x: number;
    y: number;
    add(p: Point): Point;
    clone(): Point;
    dist2(p: Point): number;
    dot(p: Point): number;
    inBound(p1: Point, p2: Point): boolean;
    inv(): Point;
    len2(): number;
    mul(n: number): Point;
    norm(): Point;
    sub(p: Point): Point;
}

interface Light {
    id: string;
    position: Point;
    centerPos: Point;
    diffuse: number;
    distance: number;
    color: string;
    radius: number;
    samples: number;
    angle: number;
    roughness: number;
    bounds(): Bounds;
    center(): Point;
    forEachSample(callback: (data: any) => void): void;
    mask(ctx: CanvasRenderingContext2D): void;
    render(): void;
}

interface Shape {    
    center?: Point;
    diffuse?: number;
    points?: Array<Point>;
    radius?: number;
    cast(ctx: CanvasRenderingContext2D, position: Point, bounds: Bounds): void;
    contains(point: Point): boolean;
    path(ctx: CanvasRenderingContext2D): void;
}