declare const canvas: HTMLCanvasElement;
declare const ctx: CanvasRenderingContext2D | null;
declare const windowEl: NodeListOf<HTMLElement>;
declare let isDragging: boolean;
declare let currentX: number;
declare let currentY: number;
declare let initialX: number;
declare let initialY: number;
declare let xOffset: number;
declare let yOffset: number;
declare let hasInitialMouseDown: boolean;
declare function setTranslate(xPos: number, yPos: number, el: HTMLElement): void;
declare class SketchCanvas {
    width: number;
    height: number;
    constructor(width: number, height: number);
}
