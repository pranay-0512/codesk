export class CoCanvasShape{
    touchOffsetX!: number;
    touchOffsetY!: number;
    isSelected!: boolean;
    isDragging!: boolean;
    id!: string;
    start_x!: number; // x coordinate of the starting point // center point for ellipse;
    start_y!: number; // y coordinate of the starting point // center point for ellipse;
    width?: number; // width of the rectangle
    height?: number; // height of the rectangle
    radius?: number; // radius of the ellipse
    angle?: number; // angle of the line // clock wise angle
    length?: number; // length of the line
    line_width!: number;
    stroke_color!: string;
    type_enum!: 'RECTANGLE' | 'DIAMOND' | 'ELLIPSE' | 'LINE' | 'ARROW' | 'FREE_DRAW' | 'TEXT' | 'ERASER' | 'SELECT';
    shape_manager!: ShapeManager;
}

export class ShapeManager {
    border!: number;
    border_color!: string;
}