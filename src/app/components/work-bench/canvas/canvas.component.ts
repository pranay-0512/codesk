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
    currentRoundness: 15,
    currentStrokeStyle: 'solid',
    currentStrokeWidth: 1,
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
    start_x: 150,
    start_y: 150,
    width: 300,
    height: 300,
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
    type_enum: 'RECTANGLE',
    start_x: 600,
    start_y: 550,
    width: 120,
    height: 100,
    line_width: this.canvas_state.currentStrokeWidth,
    stroke_color: 'purple',
    isDragging: false,
    isSelected: false,
    touchOffsetX: 0,
    touchOffsetY: 0,
    shape_manager: this.shape_manager
  };
  public shape3: CoCanvasShape = {
    id: '6adfb34dCGfd8',
    type_enum: 'RECTANGLE',
    start_x: 700,
    start_y: 250,
    width: 50,
    height: 50,
    line_width: 2,
    stroke_color: 'red',
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
    this.shapes.push(this.shape1, this.shape2, this.shape3);
    this.drawShape(this.shapes)
  }
  ngAfterViewInit(): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    canvas.onmousedown = this.mouseDown();
    canvas.onmousemove = this.mouseMove();
    canvas.onmouseup = this.mouseUp();
  }


  mouseUp() {
    return (e: MouseEvent) => {
      if(this.selected_shape){
        this.selected_shape.isDragging = false;
        this.selected_shape.isSelected = false;
      }
    }
  }
  mouseMove() {
    return (e: MouseEvent) => {
      if (this.selected_shape && this.selected_shape.isDragging) {
        this.selected_shape.start_x = e.clientX - this.selected_shape.touchOffsetX;
        this.selected_shape.start_y = e.clientY - this.selected_shape.touchOffsetY;
        this.drawShape([...this.shapes, this.selected_shape]);
      }
    }
  }
  mouseDown() {
    return (e: MouseEvent) => {
      this.selected_shape = this.shapes.find(shape => this.mouseInsideShape(e.clientX, e.clientY, shape)) as CoCanvasShape;
      if(this.selected_shape) {
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
    return x >= shape.start_x && x <= shape.start_x + shape.width && y >= shape.start_y && y <= shape.start_y + shape.height;
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
            const width = shape.width;
            const height = shape.height;
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
        }
      }
    }
  }
  

  // showShapeManager(): boolean {
  //   if (this.selected_shape && this.selected_shape.isDragging && this.selected_shape.isSelected) {
  //     const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
  //     const ctx = canvas.getContext('2d');
  //     if (ctx) {
  //       ctx.strokeStyle = this.selected_shape.shape_manager.border_color;
  //       ctx.strokeRect(this.selected_shape.start_x - this.selected_shape.shape_manager.border, this.selected_shape.start_y - this.selected_shape.shape_manager.border, this.selected_shape.width + 2*this.selected_shape.shape_manager.border, this.selected_shape.height + 2*this.selected_shape.shape_manager.border);
        
  //     }
  //     return true;
  //   }
  //   return false;
  // }


}
