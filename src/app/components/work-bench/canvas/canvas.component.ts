import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import InfiniteCanvas from 'ef-infinite-canvas'
import { CoCanvasShape } from 'src/app/_models/work-bench/canvas/canvas-shape.model';
import { CoCanvasState } from 'src/app/_models/work-bench/canvas/canvas-state.model';
import { ToolsComponent } from '../overlay-components/tools/tools.component';
import { CoCanvasTool, tools } from 'src/app/_models/work-bench/canvas/canvas-tool.model';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @Input() selectedTool!: CoCanvasTool;
  public tooled = tools[0]; 
  public is_dragging = false;
  public start_x = 0;
  public start_y = 0;
  public shapes: Array<CoCanvasShape> = [];
  public selected_shape!: CoCanvasShape;
  public shape_manager = {
    border: 5,
    border_color: 'rgba(0,0,100,0.5)'
  };
  public canvas_state: CoCanvasState = {
    showWelcomeScreen: false,
    theme: 'light',
    currentFillStyle: 'rgba(0,0,0,0)',
    currentFontFamily: 0,
    currentFontSize: 16,
    currentOpacity: 1,
    currentRoughness: 1,
    currentStrokeColor: 'black',
    currentRoundness: 25,
    currentStrokeStyle: 'solid',
    currentStrokeWidth: 5,
    currentTextAlign: 'left',
    editingGroupId: null,
    activeTool: {
      type: 'SELECTION',
      lastActiveTool: 'SELECTION'
    },
    exportBackground: false,
    gridSize: 10,
    name: 'canvas',
    previousSelectedElementId: {
      selectedElementId: {
        elementId: ''
      }
    },
    scrolledOutside: false,
    relativeScrollX: 0,
    relativeScrollY: 0,
    selectedElementIds: {
      selectedElementIds: []
    },
    viewBackgroundColor: 'rgba(255,255,255,1)',
    zoom: {
      value: 1
    }
  };
  public shape1: CoCanvasShape = {
    id: '6adfb34dCGfd8',
    type_enum: 'RECTANGLE',
    rectangle: {
      start_x: 100,
      start_y: 100,
      width: 360,
      height: 340
    },
    background_color: 'rgba(0,0,0,0)',
    line_width: this.canvas_state.currentStrokeWidth,
    stroke_color: 'black',
    isDragging: false,
    isSelected: false,
    touchOffsetX: 0,
    touchOffsetY: 0,
    shape_manager: this.shape_manager
  };
  public shape2: CoCanvasShape = {
    id: '6adfb34dCGfd9',
    type_enum: 'ELLIPSE',
    ellipse: {
      center_x: 800,
      center_y: 200,
      radius_x: 200,
      radius_y: 100
    },
    background_color: 'rgba(0,0,0,0)',
    line_width: this.canvas_state.currentStrokeWidth,
    stroke_color: 'brown',
    isDragging: false,
    isSelected: false,
    touchOffsetX: 0,
    touchOffsetY: 0,
    shape_manager: this.shape_manager
  };
  public shape3: CoCanvasShape = {
    id: '6adfb34dCGfd10',
    type_enum: 'LINE',
    line: {
      start_x: 500,
      start_y: 500,
      end_x: 200,
      end_y: 500,
      lineCap: 'round',
      lineJoin: 'round'
    },
    background_color: 'rgba(0,0,0,0)',
    line_width: this.canvas_state.currentStrokeWidth,
    stroke_color: 'red',
    isDragging: false,
    isSelected: false,
    touchOffsetX: 0,
    touchOffsetY: 0,
    shape_manager: this.shape_manager
  };
  public shape4: CoCanvasShape = {
    id: '6adfb34dCGfd11',
    type_enum: 'ARROW',
    arrow: {
      start_x: 600,
      start_y: 200,
      end_x: 500,
      end_y: 200
    },
    background_color: 'rgba(0,0,0,0)',
    line_width: this.canvas_state.currentStrokeWidth,
    stroke_color: 'blue',
    isDragging: false,
    isSelected: false,
    touchOffsetX: 0,
    touchOffsetY: 0,
    shape_manager: this.shape_manager
  };
  public shape5: CoCanvasShape = {
    id: '6adfb34dCGfd12',
    type_enum: 'FREE_DRAW',
    free_draw: {
      start_x: 800,
      start_y: 90,
      points: [
        {"x": 0, "y": 0},
        {"x": 1, "y": 0},
        {"x": 4, "y": 0},
        {"x": 9, "y": 0},
        {"x": 15, "y": 0},
        {"x": 20, "y": 0},
        {"x": 24, "y": 1},
        {"x": 30, "y": 1},
        {"x": 35, "y": 1},
        {"x": 40, "y": 1},
        {"x": 47, "y": 2},
        {"x": 55, "y": 3},
        {"x": 67, "y": 4},
        {"x": 82, "y": 8},
        {"x": 98, "y": 9},
        {"x": 113, "y": 11},
        {"x": 124, "y": 13},
        {"x": 132, "y": 14},
        {"x": 137, "y": 14},
        {"x": 143, "y": 15},
        {"x": 151, "y": 16},
        {"x": 159, "y": 18},
        {"x": 169, "y": 19},
        {"x": 177, "y": 20},
        {"x": 185, "y": 21},
        {"x": 193, "y": 22},
        {"x": 197, "y": 23},
        {"x": 200, "y": 23},
        {"x": 201, "y": 23},
        {"x": 201, "y": 24},
        {"x": 201, "y": 25},
        {"x": 203, "y": 26},
        {"x": 205, "y": 29},
        {"x": 206, "y": 30},
        {"x": 207, "y": 33},
        {"x": 209, "y": 35},
        {"x": 211, "y": 38},
        {"x": 211, "y": 43},
        {"x": 213, "y": 47},
        {"x": 215, "y": 51},
        {"x": 216, "y": 55},
        {"x": 216, "y": 56},
        {"x": 216, "y": 58},
        {"x": 217, "y": 59},
        {"x": 217, "y": 60},
        {"x": 219, "y": 60},
        {"x": 219, "y": 61},
        {"x": 219, "y": 63},
        {"x": 221, "y": 65},
        {"x": 223, "y": 66},
        {"x": 223, "y": 67},
        {"x": 224, "y": 69},
        {"x": 227, "y": 70},
        {"x": 229, "y": 72},
        {"x": 229, "y": 73},
        {"x": 232, "y": 75},
        {"x": 234, "y": 75},
        {"x": 236, "y": 76},
        {"x": 238, "y": 78},
        {"x": 240, "y": 79},
        {"x": 243, "y": 80},
        {"x": 246, "y": 80},
        {"x": 251, "y": 82},
        {"x": 254, "y": 83},
        {"x": 258, "y": 83},
        {"x": 261, "y": 83},
        {"x": 263, "y": 83},
        {"x": 265, "y": 83},
        {"x": 266, "y": 82},
        {"x": 270, "y": 80},
        {"x": 274, "y": 77},
        {"x": 278, "y": 73},
        {"x": 282, "y": 70},
        {"x": 286, "y": 68},
        {"x": 287, "y": 64},
        {"x": 288, "y": 62},
        {"x": 291, "y": 59},
        {"x": 292, "y": 56},
        {"x": 292, "y": 53},
        {"x": 294, "y": 49},
        {"x": 295, "y": 47},
        {"x": 295, "y": 44},
        {"x": 296, "y": 43},
        {"x": 296, "y": 42},
        {"x": 296, "y": 40},
        {"x": 296, "y": 39},
        {"x": 296, "y": 37},
        {"x": 296, "y": 34},
        {"x": 296, "y": 32},
        {"x": 296, "y": 30},
        {"x": 296, "y": 28},
        {"x": 296, "y": 26},
        {"x": 296, "y": 25},
        {"x": 297, "y": 25},
        {"x": 298, "y": 24},
        {"x": 299, "y": 22},
        {"x": 299, "y": 20},
        {"x": 300, "y": 17},
        {"x": 301, "y": 16},
        {"x": 302, "y": 15},
        {"x": 302, "y": 14},
        {"x": 304, "y": 11},
        {"x": 308, "y": 6},
        {"x": 314, "y": -1},
        {"x": 319, "y": -9},
        {"x": 324, "y": -13},
        {"x": 327, "y": -16},
        {"x": 327, "y": -17},
        {"x": 328, "y": -17},
        {"x": 331, "y": -18},
        {"x": 334, "y": -22},
        {"x": 337, "y": -24},
        {"x": 339, "y": -26},
        {"x": 339, "y": -26}
      ]
    },
    background_color: 'rgba(0,0,0,0)',
    line_width: this.canvas_state.currentStrokeWidth,
    stroke_color: 'green',
    isDragging: false,
    isSelected: false,
    touchOffsetX: 0,
    touchOffsetY: 0,
    shape_manager: this.shape_manager
  };
  constructor() {
    const body = document.querySelector('body');
    body?.setAttribute('style', 'overflow: hidden');
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    canvas.onmousedown = this.mouseDown();
    canvas.onmousemove = this.mouseMove();
    canvas.onmouseup = this.mouseUp();
    if(localStorage && localStorage.getItem('shapes')) {
      this.shapes = JSON.parse(localStorage.getItem('shapes') ?? '[]');
      this.drawShape(this.shapes);
    }
    else {
      this.shapes.push(this.shape5);
      this.drawShape(this.shapes)
    }
  }
  mouseUp() {
    return (e: MouseEvent) => {
      localStorage.setItem('shapes', JSON.stringify(this.shapes));
      switch (this.tooled.enum) {
        case 'SELECT_TOOL':
          if(this.selected_shape){
            const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
            canvas.style.cursor = 'grab';
            this.selected_shape.isDragging = false;
            this.selected_shape.isSelected = false;
            
          }
          break;
      }
      
    }
  }
  mouseMove() {
    return (e: MouseEvent) => {
      // switch (this.tooled.enum) {
      //   case 'FREE_DRAW':
      //     if (e.buttons === 1) {
      //       this.drawFreeDraw(e.clientX, e.clientY);  
      //     }
      //     break;
      //   case 'SELECT_TOOL':
      //     if (this.selected_shape && this.selected_shape.isDragging) {
      //       const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
      //       canvas.style.cursor = 'grabbing';
      //       this.selected_shape.start_x = e.clientX - this.selected_shape.touchOffsetX;
      //       this.selected_shape.start_y = e.clientY - this.selected_shape.touchOffsetY;
      //       this.drawShape([...this.shapes, this.selected_shape]);
      //     }
      //     break;
      //   case 'ELLIPSE':
      // }
        const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
        canvas.style.cursor = 'grab';
    }
  }
  mouseDown() {
    return (e: MouseEvent) => {
      // switch (this.tooled.enum) {
      //   case 'FREE_DRAW':
      //     this.start_x = e.clientX;
      //     this.start_y = e.clientY;
      //     this.drawFreeDraw(e.clientX, e.clientY);
      //     break;
      //   case 'SELECT_TOOL':
      //     this.selected_shape = this.shapes.find(shape => this.mouseInsideShape(e.clientX, e.clientY, shape)) as CoCanvasShape;
      //     if(this.selected_shape) {
      //       const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
      //       canvas.style.cursor = 'grabbing';
      //       this.selected_shape.isDragging = true;
      //       this.selected_shape.isSelected = true;
      //       this.selected_shape.touchOffsetX = e.clientX - this.selected_shape.start_x;
      //       this.selected_shape.touchOffsetY = e.clientY - this.selected_shape.start_y;
      //     }
      //     this.start_x = e.clientX;
      //     this.start_y = e.clientY;
      //     break;
      // }
            
    }
  }
  mouseInsideShape(x: number, y: number, shape: CoCanvasShape): boolean {
    // switch (shape.type_enum) {
    //   case 'RECTANGLE':
    //     return x >= shape.start_x && x <= shape.start_x + (shape.width ?? 0) && y >= shape.start_y && y <= shape.start_y + (shape.height ?? 0);
      
    //   case 'ELLIPSE':
    //     return Math.pow((x - shape.start_x), 2) / Math.pow((shape.radius ?? 0), 2) + Math.pow((y - shape.start_y), 2) / Math.pow((shape.radius ?? 0), 2) <= 1;
      
    //   case 'LINE':
    //     return x >= shape.start_x && x <= shape.start_x + (shape.length ?? 0) * Math.cos((shape.angle ?? 0) * Math.PI / 180) && y >= shape.start_y - 20 && y <= shape.start_y + 20 + (shape.length ?? 0) * Math.sin((shape.angle ?? 0) * Math.PI / 180);
      
    //   case 'ARROW':
    //     return true;
      
    //   case 'FREE_DRAW':
    //     return true;
      
    //   case 'TEXT':
    //     return true;
       
    //   default:
    //     return false;
    // }

    return false;
  }

  drawShape(shapes: CoCanvasShape[]): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    if (ctx) {
      for (let shape of shapes) {
        // switch (shape.type_enum) {
        //   case 'RECTANGLE':
        //     ctx.strokeStyle = shape.stroke_color;
        //     ctx.lineWidth = shape.line_width;
        //     ctx.beginPath();
        //     const radius = this.canvas_state.currentRoundness;
        //     const x = shape.start_x;
        //     const y = shape.start_y;
        //     const width = shape.width ?? 0;
        //     const height = shape.height ?? 0;
        //     ctx.moveTo(x + radius, y);
        //     ctx.lineTo(x + width - radius, y);
        //     ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        //     ctx.lineTo(x + width, y + height - radius);
        //     ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        //     ctx.lineTo(x + radius, y + height);
        //     ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        //     ctx.lineTo(x, y + radius);
        //     ctx.quadraticCurveTo(x, y, x + radius, y);
        //     ctx.stroke();
        //     break;
          
        //   case 'ELLIPSE':
        //     ctx.strokeStyle = shape.stroke_color;
        //     ctx.lineWidth = shape.line_width;
        //     ctx.beginPath();
        //     ctx.ellipse(shape.start_x, shape.start_y, (shape.radius ?? 0), (shape.radius ?? 0), 0, 0, 2 * Math.PI);
        //     ctx.stroke();
        //     break;
          
        //   case 'LINE':
        //     ctx.strokeStyle = shape.stroke_color;
        //     ctx.lineWidth = shape.line_width;
        //     ctx.beginPath();
        //     ctx.moveTo(shape.start_x, shape.start_y);
        //     ctx.lineTo(shape.start_x + (shape.length ?? 0) * Math.cos((shape.angle ?? 0) * Math.PI / 180), shape.start_y + (shape.length ?? 0) * Math.sin((shape.angle ?? 0) * Math.PI / 180));
        //     ctx.stroke();
        //     break;
          
        //   case 'ARROW':
        //     ctx.strokeStyle = shape.stroke_color;
        //     ctx.lineWidth = shape.line_width;
        //     ctx.beginPath();
        //     ctx.moveTo(shape.start_x, shape.start_y);
        //     ctx.lineTo(shape.start_x + (shape.length ?? 0) * Math.cos((shape.angle ?? 0) * Math.PI / 180), shape.start_y + (shape.length ?? 0) * Math.sin((shape.angle ?? 0) * Math.PI / 180));
        //     ctx.stroke();
        //     break;

        //   case 'FREE_DRAW':
        //     ctx.strokeStyle = shape.stroke_color;
        //     ctx.lineWidth = shape.line_width;
        //     ctx.lineJoin = 'round';
        //     ctx.lineCap = 'round';
        //     ctx.beginPath();
        //     ctx.moveTo(shape.start_x, shape.start_y);
        //     ctx.lineTo(shape.start_x, shape.start_y);
        //     ctx.stroke();
        //     break;
        // }
        switch (shape.type_enum) {
          case 'RECTANGLE':
            ctx.strokeStyle = shape.stroke_color;
            ctx.lineWidth = shape.line_width;
            ctx.beginPath();
            const radius = this.canvas_state.currentRoundness;
            const x = shape.rectangle?.start_x ?? 0;
            const y = shape.rectangle?.start_y ?? 0;
            const width = shape.rectangle?.width ?? 0;
            const height = shape.rectangle?.height ?? 0;
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.stroke();
            break;
          
          case 'ELLIPSE':
            ctx.strokeStyle = shape.stroke_color;
            ctx.lineWidth = shape.line_width;
            ctx.beginPath();
            ctx.ellipse(shape.ellipse?.center_x ?? 0, shape.ellipse?.center_y ?? 0, (shape.ellipse?.radius_x ?? 0), (shape.ellipse?.radius_y ?? 0), 0, 0, 2 * Math.PI);
            ctx.stroke();
            break;

          case 'LINE':
            ctx.strokeStyle = shape.stroke_color;
            ctx.lineWidth = shape.line_width;
            ctx.lineCap = shape.line?.lineCap as CanvasLineCap ?? 'round';
            ctx.lineJoin = shape.line?.lineJoin as CanvasLineJoin ?? 'round';
            ctx.beginPath();
            ctx.moveTo(shape.line?.start_x ?? 0, shape.line?.start_y ?? 0);
            ctx.lineTo(shape.line?.end_x ?? 0, shape.line?.end_y ?? 0);
            ctx.stroke();
            break;

          case 'ARROW':
            const toy = shape.arrow?.end_y ?? 0;
            const tox = shape.arrow?.end_x ?? 0;
            const fromy = shape.arrow?.start_y ?? 0;
            const fromx = shape.arrow?.start_x ?? 0;
            var headlen = 10;
            var angle = Math.atan2(toy-fromy,tox-fromx);
            ctx.strokeStyle = shape.stroke_color;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(fromx, fromy);
            ctx.lineTo(tox, toy);
            ctx.lineWidth = this.canvas_state.currentStrokeWidth;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(tox, toy);
            ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                        toy-headlen*Math.sin(angle-Math.PI/7));
            ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
                        toy-headlen*Math.sin(angle+Math.PI/7));
            ctx.lineTo(tox, toy);
            ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                        toy-headlen*Math.sin(angle-Math.PI/7));
            ctx.stroke();
            ctx.restore();
            break
          
          case 'FREE_DRAW':
            for (let point of shape.free_draw?.points ?? []) {
              point.x += shape.free_draw?.start_x ?? 0;
              point.y += shape.free_draw?.start_y ?? 0;
            }
            const initX = shape.free_draw?.points[0].x ?? 0 + (shape.free_draw?.start_x ?? 0);
            const initY = shape.free_draw?.points[0].y ?? 0 + (shape.free_draw?.start_y ?? 0);
            ctx.strokeStyle = shape.stroke_color;
            ctx.lineWidth = shape.line_width;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(initX, initY);
            for (let i = 1; i < (shape.free_draw?.points.length ?? 0); i++) {
              ctx.lineTo(shape.free_draw?.points[i].x ?? 0 + (shape.free_draw?.start_x ?? 0), shape.free_draw?.points[i].y ?? 0 + (shape.free_draw?.start_y ?? 0));
            }
            ctx.stroke();
            break;
        }

      }
    }
  }

  // drawFreeDraw(x: number, y: number): void {
  //   const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
  //   const ctx = canvas.getContext('2d');
  //   if (ctx) {
  //     ctx.strokeStyle = this.canvas_state.currentStrokeColor;
  //     ctx.lineWidth = this.canvas_state.currentStrokeWidth;
  //     ctx.lineJoin = 'round';
  //     ctx.lineCap = 'round';
  //     ctx.beginPath();
  //     ctx.moveTo(this.start_x, this.start_y);
  //     ctx.lineTo(x, y);
  //     ctx.stroke();
  //     this.start_x = x;
  //     this.start_y = y;
  //   }
  //   const drawnShape: CoCanvasShape = {
  //     id: '6adfb34dCGfd8',
  //     type_enum: 'FREE_DRAW',
  //     start_x: this.start_x,
  //     start_y: this.start_y,
  //     line_width: this.canvas_state.currentStrokeWidth,
  //     stroke_color: this.canvas_state.currentStrokeColor,
  //     isDragging: false,
  //     isSelected: false,
  //     width: 50,
  //     height: 50,
  //     touchOffsetX: 0,
  //     touchOffsetY: 0,
  //     shape_manager: this.shape_manager
  //   };
  //   this.shapes.push(drawnShape);
    
  // }
}
