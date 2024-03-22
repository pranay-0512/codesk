export class CoCanvasTool {
    id?: string;
    enum!: string;
    name!: string;
    icon!: string;
    number!: number;
    is_active!: boolean;
}
export const tools: Array<CoCanvasTool> = [
    { 
      name: 'Select tool',
      enum: 'SELECT',
      icon: 'crop_free',
      is_active: false,
      number: 1
    },
    {
      name: 'Pan tool',
      enum: 'PAN',
      icon: 'pan_tool',
      is_active: false,
      number: 2
    },
    {
      name: 'Rectangle tool',
      enum: 'RECTANGLE',
      icon: 'check_box_outline_blank',
      is_active: false,
      number: 3
    },
    {
      name: 'Ellipse tool',
      enum: 'ELLIPSE',
      icon: 'circle',
      is_active: false,
      number: 4
    },
    {
      name: 'Arrow tool',
      enum: 'ARROW',
      icon: 'arrow_outward',
      is_active: false,
      number: 5
    },
    {
      name: 'Line tool',
      enum: 'LINE',
      icon: 'horizontal_rule',
      is_active: false,
      number: 6
    },
    {
      name: 'Free draw tool',
      enum: 'FREE_DRAW',
      icon: 'brush',
      is_active: false,
      number: 7
    },
    {
      name: 'Text tool',
      enum: 'TEXT',
      icon: 'format_size',
      is_active: false,
      number: 8
    },
    {
      name: 'Eraser tool',
      enum: 'ERASER',
      icon: 'delete',
      is_active: false,
      number: 9
    }
];