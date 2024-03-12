export class CoCanvasShape{
    touchOffsetX!: number;
    touchOffsetY!: number;
    isSelected!: boolean;
    isDragging!: boolean;
    id!: string;
    rectangle?: {
        start_x: number;
        start_y: number;
        end_x: number;
        end_y: number;
    }
    ellipse?: {
        center_x: number;
        center_y: number;
        radius_x: number;
        radius_y: number;
    }
    line?: {
        start_x: number;
        start_y: number;
        end_x: number;
        end_y: number;
        lineCap: 'round' | 'butt' | 'square';
        lineJoin: 'round' | 'bevel' | 'miter';
    }
    arrow?: {
        start_x: number;
        start_y: number;
        end_x: number;
        end_y: number;
    }
    text?: {
        start_x: number;
        start_y: number;
        text: string;
        font_size: string;
    }
    free_draw?: {
        startingPoint: [x: number, y: number];
        lastCommittedPoint: [x: number, y: number];
        points: [x: number, y: number][];
    }
    eraser?: {
        mouse_x: number;
        mouse_y: number;
    }
    // start_x!: number; // x coordinate of the starting point // center point for ellipse;
    // start_y!: number; // y coordinate of the starting point // center point for ellipse;
    // width?: number; // width of the rectangle
    // height?: number; // height of the rectangle
    // radius?: number; // radius of the ellipse
    // angle?: number; // angle of the line // clock wise angle
    // length?: number; // length of the line
    line_width!: number;
    stroke_color!: string;
    background_color?: string;
    type_enum!: 'RECTANGLE' | 'ELLIPSE' | 'LINE' | 'ARROW' | 'FREE_DRAW' | 'TEXT' | 'ERASER';
    shape_manager!: ShapeManager;
}

export class ShapeManager {
    border!: number;
    border_color!: string;
}