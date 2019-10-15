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
        a: Point;
        b: Point;
    }
    
    export interface Shape {
        center?: Point;
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
        inBound(a: Point, b: Point): boolean;
        inv(): Point;
        len2(): number;
        mul(n: number): Point;
        norm(): Point;
        sub(p: Point): Point;
    }

    export class Polygon {
        points: Point[];
    
        constructor(points: Point[]);

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
        radius: number;
    
        constructor(center: Point, radius: number);

        bounds(): Bounds;
        cast(ctx: CanvasRenderingContext2D, position: Point, bounds: Bounds): void;
        contains(point: Point): boolean;
        path(ctx: CanvasRenderingContext2D): void;
        getTan2 (radius: number, center: Point): Point[];
    }

    export class DarkMask {
        lights: Light[];
        color: string;

        constructor(lights: Light[], color: string);

        render(ctx: CanvasRenderingContext2D, width: number, height: number): void;
    }

    export class Light {
        id: string;
        position: Point;
        centerPos: Point;
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
        move(x: number, y: number): void;
        orientationCenter(): Point;
        render(): void;
    }

    export class LineOfSight {
        light: Light;
        boundaries: Shape[];

        constructor(light: Light, boundaries: Shape[]);

        cast(ctx: CanvasRenderingContext2D): void;
        createCache(width: number, height: number): void;
        render(ctx: CanvasRenderingContext2D, width: number, height: number): void;
    }
}

declare module 'lucendi' {
	export = Lucendi;
}