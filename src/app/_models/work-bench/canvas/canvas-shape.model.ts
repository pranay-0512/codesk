export class CoCanvasShape{
    touchOffsetX!: number;
    touchOffsetY!: number;
    isSelected!: boolean;
    isDragging!: boolean;
    id!: string;
    start_x!: number;
    start_y!: number;
    width!: number;
    height!: number;
    stroke_color!: string;
    type_enum!: 'RECTANGLE' | 'DIAMOND' | 'ELLIPSE' | 'LINE' | 'ARROW' | 'FREE_DRAW' | 'TEXT' | 'ERASER' | 'SELECT';
    shape_manager!: ShapeManager;
}

export class ShapeManager {
    border!: number;
    border_color!: string;
}