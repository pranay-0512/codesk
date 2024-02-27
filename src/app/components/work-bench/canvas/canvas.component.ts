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
  public shape1: CoCanvasShape = {
    id: '6adfb34dCGfd8',
    type_enum: 'RECTANGLE',
    start_x: 150,
    start_y: 150,
    width: 100,
    height: 100,
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
    start_x: 300,
    start_y: 150,
    width: 150,
    height: 100,
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
    this.shapes.push(this.shape1, this.shape2);
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
      this.showShapeManager();
      if(this.selected_shape){
        this.selected_shape.isDragging = false;
        this.selected_shape.isSelected = false;
      }
    }
  }
  mouseMove() {
    return (e: MouseEvent) => {
      if (this.selected_shape && this.selected_shape.isDragging) {
        this.showShapeManager();
        this.selected_shape.start_x = e.clientX - this.selected_shape.touchOffsetX;
        this.selected_shape.start_y = e.clientY - this.selected_shape.touchOffsetY;
        this.drawShape([...this.shapes, this.selected_shape]);
      }
    }
  }
  mouseDown() {
    return (e: MouseEvent) => {
      this.selected_shape = this.shapes.find(shape => this.mouseInsideShape(e.clientX, e.clientY, shape)) as CoCanvasShape;
      for (let shape of this.shapes) {
        if(this.mouseInsideShape(e.clientX, e.clientY, shape)) {
          this.selected_shape.isSelected = false;
        }
      }
      if(this.selected_shape) {
        this.selected_shape.isDragging = true;
        this.selected_shape.isSelected = true;
        this.selected_shape.touchOffsetX = e.clientX - this.selected_shape.start_x;
        this.selected_shape.touchOffsetY = e.clientY - this.selected_shape.start_y;
      }
      this.start_x = e.clientX;
      this.start_y = e.clientY;
      this.showShapeManager();
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
            ctx.beginPath();
            const radius = 10 // Specify the radius for rounded corners
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
  

  showShapeManager(): void {
    if (this.selected_shape && this.selected_shape.isDragging && this.selected_shape.isSelected) {
      const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = this.selected_shape.shape_manager.border_color;
        ctx.strokeRect(this.selected_shape.start_x - this.selected_shape.shape_manager.border, this.selected_shape.start_y - this.selected_shape.shape_manager.border, this.selected_shape.width + 2*this.selected_shape.shape_manager.border, this.selected_shape.height + 2*this.selected_shape.shape_manager.border);
      }
    }
  }


}
