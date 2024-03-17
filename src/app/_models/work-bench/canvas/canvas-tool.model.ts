export class CoCanvasTool {
    id?: string;
    enum!: string;
    name!: string;
    icon!: string;
    is_active!: boolean;
}
export const tools: Array<CoCanvasTool> = [
    { 
      name: 'Select tool',
      enum: 'SELECT',
      icon: 'crop_free',
      is_active: false
    },
    {
      name: 'Pan tool',
      enum: 'PAN',
      icon: 'pan_tool',
      is_active: false
    },
    {
      name: 'Rectangle tool',
      enum: 'RECTANGLE',
      icon: 'check_box_outline_blank',
      is_active: false
    },
    {
      name: 'Ellipse tool',
      enum: 'ELLIPSE',
      icon: 'circle',
      is_active: false
    },
    {
      name: 'Arrow tool',
      enum: 'ARROW',
      icon: 'arrow_outward',
      is_active: false
    },
    {
      name: 'Line tool',
      enum: 'LINE',
      icon: 'horizontal_rule',
      is_active: false
    },
    {
      name: 'Free draw tool',
      enum: 'FREE_DRAW',
      icon: 'brush',
      is_active: false
    },
    {
      name: 'Text tool',
      enum: 'TEXT',
      icon: 'format_size',
      is_active: false
    },
    {
      name: 'Eraser tool',
      enum: 'ERASER',
      icon: 'delete',
      is_active: false
    }
];