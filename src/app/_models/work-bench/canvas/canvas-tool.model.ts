export class CoCanvasTool {
    id?: string;
    enum!: string;
    name!: string;
    icon_path!: string;
    icon_path_invert!: string;
    number!: number;
    is_active!: boolean;
}
export const tools: Array<CoCanvasTool> = [
    { 
      name: 'Select tool',
      enum: 'SELECT',
      icon_path: 'https://svgshare.com/i/15S8.svg',
      icon_path_invert: 'https://svgshare.com/i/15R6.svg',
      is_active: false,
      number: 1
    },
    {
      name: 'Pan tool',
      enum: 'PAN',
      icon_path: 'https://svgshare.com/i/15RH.svg',
      icon_path_invert: 'https://svgshare.com/i/15RK.svg',
      is_active: false,
      number: 2
    },
    {
      name: 'Rectangle tool',
      enum: 'RECTANGLE',
      icon_path: 'https://svgshare.com/i/15Qv.svg',
      icon_path_invert: 'https://svgshare.com/i/15SV.svg',
      is_active: false,
      number: 3
    },
    {
      name: 'Ellipse tool',
      enum: 'ELLIPSE',
      icon_path: 'https://svgshare.com/i/15Rd.svg',
      icon_path_invert: 'https://svgshare.com/i/15Se.svg',
      is_active: false,
      number: 4
    },
    {
      name: 'Arrow tool',
      enum: 'ARROW',
      icon_path: 'https://svgshare.com/i/15S0.svg',
      icon_path_invert: 'https://svgshare.com/i/15Qw.svg',
      is_active: false,
      number: 5
    },
    {
      name: 'Line tool',
      enum: 'LINE',
      icon_path: 'https://svgshare.com/i/15QZ.svg',
      icon_path_invert: 'https://svgshare.com/i/15Ro.svg',
      is_active: false,
      number: 6
    },
    {
      name: 'Free draw tool',
      enum: 'FREE_DRAW',
      icon_path: 'https://svgshare.com/i/15Re.svg',
      icon_path_invert: 'https://svgshare.com/i/15SW.svg',
      is_active: false,
      number: 7
    },
    {
      name: 'Text tool',
      enum: 'TEXT',
      icon_path: 'https://svgshare.com/i/15SU.svg',
      icon_path_invert: 'https://svgshare.com/i/15Rp.svg',
      is_active: false,
      number: 8
    },
    {
      name: 'Eraser tool',
      enum: 'ERASER',
      icon_path: 'https://svgshare.com/i/15S9.svg',
      icon_path_invert: 'https://svgshare.com/i/15SL.svg',
      is_active: false,
      number: 9
    }
];