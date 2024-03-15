export class CoCanvasShape{
    touchOffsetX!: number;
    touchOffsetY!: number;
    isSelected!: boolean;
    isDragging!: boolean;
    id!: string;
    rectangle?: {
        start_x: number;
        start_y: number;
        width: number;
        height: number;
        roundness: number;
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
        lineCap: 'round' | 'butt' | 'square';
        lineJoin: 'round' | 'bevel' | 'miter';
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
    line_width!: number;
    stroke_color!: string;
    background_color?: string;
    type_enum!: 'RECTANGLE' | 'ELLIPSE' | 'LINE' | 'ARROW' | 'FREE_DRAW' | 'TEXT' | 'ERASER';
}

export class ShapeManager {
    border!: number;
    border_color!: string;
}