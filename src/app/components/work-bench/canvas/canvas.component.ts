import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import InfiniteCanvas from 'ef-infinite-canvas'
import { CoCanvasShape } from 'src/app/_models/work-bench/canvas/canvas-shape.model';
import { CoCanvasState } from 'src/app/_models/work-bench/canvas/canvas-state.model';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @Input() selectedTool!: string;
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
    currentStrokeWidth: 2.5,
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
    start_x: 1200,
    start_y: 200,
    width: 400,
    height: 400,
    line_width: this.canvas_state.currentStrokeWidth,
    stroke_color: 'black',
    isDragging: false,
    isSelected: false,
    touchOffsetX: 0,
    touchOffsetY: 0,
    shape_manager: this.shape_manager
  };
  public shape2: CoCanvasShape = {
    id: '6adfb34dCGfd8',
    type_enum: 'ELLIPSE',
    start_x: 500, // center point for ellipse
    start_y: 400, // center point for ellipse
    radius: 200, 
    line_width: this.canvas_state.currentStrokeWidth,
    stroke_color: 'blue',
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
    if(localStorage.getItem('shapes')) {
      this.shapes = JSON.parse(localStorage.getItem('shapes') ?? '');
      this.drawShape(this.shapes);
    }
    else {
      this.shapes.push(this.shape1, this.shape2);
      this.drawShape(this.shapes)
    }
  }


  mouseUp() {
    return (e: MouseEvent) => {
      if(this.selected_shape){
        const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
        canvas.style.cursor = 'grab';
        this.selected_shape.isDragging = false;
        this.selected_shape.isSelected = false;
        localStorage.setItem('shapes', JSON.stringify(this.shapes));
      }
    }
  }
  mouseMove() {
    return (e: MouseEvent) => {
      if (this.selected_shape && this.selected_shape.isDragging) {
        const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
        canvas.style.cursor = 'grabbing';
        this.selected_shape.start_x = e.clientX - this.selected_shape.touchOffsetX;
        this.selected_shape.start_y = e.clientY - this.selected_shape.touchOffsetY;
        this.drawShape([...this.shapes, this.selected_shape]);
      }
      else {
        const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
        canvas.style.cursor = 'grab';
      }
    }
  }
  mouseDown() {
    return (e: MouseEvent) => {
      this.selected_shape = this.shapes.find(shape => this.mouseInsideShape(e.clientX, e.clientY, shape)) as CoCanvasShape;
      if(this.selected_shape) {
        const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
        canvas.style.cursor = 'grabbing';
        this.selected_shape.isDragging = true;
        this.selected_shape.isSelected = true;
        this.selected_shape.touchOffsetX = e.clientX - this.selected_shape.start_x;
        this.selected_shape.touchOffsetY = e.clientY - this.selected_shape.start_y;
      }
      this.start_x = e.clientX;
      this.start_y = e.clientY;      
    }
  }
  mouseInsideShape(x: number, y: number, shape: CoCanvasShape): boolean {
    switch (shape.type_enum) {
      case 'RECTANGLE':
        return x >= shape.start_x && x <= shape.start_x + (shape.width ?? 0) && y >= shape.start_y && y <= shape.start_y + (shape.height ?? 0);
      
      case 'ELLIPSE':
        return Math.pow((x - shape.start_x), 2) / Math.pow((shape.radius ?? 0), 2) + Math.pow((y - shape.start_y), 2) / Math.pow((shape.radius ?? 0), 2) <= 1;
      
      case 'LINE':
        return x >= shape.start_x && x <= shape.start_x + (shape.length ?? 0) * Math.cos((shape.angle ?? 0) * Math.PI / 180) && y >= shape.start_y - 20 && y <= shape.start_y + 20 + (shape.length ?? 0) * Math.sin((shape.angle ?? 0) * Math.PI / 180);
      
      case 'ARROW':
        return true;
      
      case 'FREE_DRAW':
        return true;
      
      case 'TEXT':
        return true;
       
      default:
        return false;
    }
  }

  drawShape(shapes: CoCanvasShape[]): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    if (ctx) {
      for (let shape of shapes) {
        switch (shape.type_enum) {
          case 'RECTANGLE':
            ctx.strokeStyle = shape.stroke_color;
            ctx.lineWidth = shape.line_width;
            ctx.beginPath();
            const radius = this.canvas_state.currentRoundness;
            const x = shape.start_x;
            const y = shape.start_y;
            const width = shape.width ?? 0;
            const height = shape.height ?? 0;
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
            ctx.ellipse(shape.start_x, shape.start_y, (shape.radius ?? 0), (shape.radius ?? 0), 0, 0, 2 * Math.PI);
            ctx.stroke();
            break;
          case 'LINE':
            ctx.strokeStyle = shape.stroke_color;
            ctx.lineWidth = shape.line_width;
            ctx.beginPath();
            ctx.moveTo(shape.start_x, shape.start_y);
            ctx.lineTo(shape.start_x + (shape.length ?? 0) * Math.cos((shape.angle ?? 0) * Math.PI / 180), shape.start_y + (shape.length ?? 0) * Math.sin((shape.angle ?? 0) * Math.PI / 180));
            ctx.stroke();
            break;
        }
      }
    }
  }
}
