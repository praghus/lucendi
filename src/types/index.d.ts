declare namespace Lucendi {
    export interface StringTMap<T> {
        [key: string]: T;
    }

    export interface NumberTMap<T> {
        [key: number]: T;
    }

    export interface CanvasBuffer {
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        width: number;
        height: number;
    }

    export interface Bounds {
        p1: Point;
        p2: Point;
    }
    
    export interface Shape {
        center?: Point;
        diffuse?: number;
        points?: Array<Point>;
        radius?: number;
        cast(ctx: CanvasRenderingContext2D, position: Point, bounds: Bounds): void;
        contains(point: Point): boolean;
        path(ctx: CanvasRenderingContext2D): void;
    }

    export class Point {
        x: number;
        y: number;

        constructor (x: number, y: number); 

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

    export class Polygon {
        points: Array<Point>;
        diffuse: number;
    
        constructor(options?: StringTMap<any>);

        bounds(): Bounds;
        cast(ctx: CanvasRenderingContext2D, position: Point, bounds: Bounds): void;
        contains(point: Point): boolean;
        path(ctx: CanvasRenderingContext2D): void;
    }

    export class Box extends Polygon {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export class Circle {
        center: Point;
        diffuse: number;
        radius: number;
    
        constructor(options?: StringTMap<any>);

        bounds(): Bounds;
        cast(ctx: CanvasRenderingContext2D, position: Point, bounds: Bounds): void;
        contains(point: Point): boolean;
        path(ctx: CanvasRenderingContext2D): void;
        getTan2 (radius: number, center: Point): Point[];
    }

    export class Dark {
        lights: Array<Light>;
        color: string;

        constructor(options?: StringTMap<any>);

        calculate(width: number, height: number): void;
        render(ctx: CanvasRenderingContext2D): void;
    }

    export class Light {
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

        constructor (options?: StringTMap<any>)

        bounds(): Bounds;
        center(): Point;
        forEachSample(callback: (data: any) => void): void;
        mask(ctx: CanvasRenderingContext2D): void;
        orientationCenter(): Point;
        render(): void;
    }

    export class LineOfSight {
        light: Light;
        lightmask: Shape[];

        constructor(options?: StringTMap<any>);

        calculate(width: number, height: number): void;
        cast(ctx: CanvasRenderingContext2D): void;
        createCache(width: number, height: number): void;
        render(ctx: CanvasRenderingContext2D): void;
    }
}

declare module 'lucendi' {
	export = Lucendi;
}