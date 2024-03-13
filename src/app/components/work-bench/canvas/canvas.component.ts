import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CoCanvasShape } from 'src/app/_models/work-bench/canvas/canvas-shape.model';
import { CoCanvasState } from 'src/app/_models/work-bench/canvas/canvas-state.model';
import { ToolsComponent } from '../overlay-components/tools/tools.component';
import { CoCanvasTool, tools } from 'src/app/_models/work-bench/canvas/canvas-tool.model';
import { WebsocketShapeService } from 'src/app/_services/websocket/websocket-shape.service';
import InfiniteCanvas, { InfiniteCanvasRenderingContext2D } from 'ef-infinite-canvas'
import {v4 as uuidv4} from 'uuid';
import { fabric } from 'fabric';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @Input() selectedTool!: CoCanvasTool;
  public tooled = tools[2]; 
  public fabricCanvas!: fabric.Canvas;
  // public tooled = tools[6]; 
  public is_dragging = false;
  public start_x = 0;
  public start_y = 0;
  public end_x = 0;
  public end_y = 0;
  public shapes: Array<CoCanvasShape> = [];
  public selected_shape!: CoCanvasShape;
  public infCanvas!: any;
  public ctx!: InfiniteCanvasRenderingContext2D;
  public uuid!: string;
  public isPanning: boolean = false;
  
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
    currentRoundness: 5,
    currentStrokeStyle: 'solid',
    currentStrokeWidth: 5,
    currentTextAlign: 'left',
    editingGroupId: null,
    activeTool: {
      type: this.tooled.enum,
      lastActiveTool: 'SELECTION'
    },
    exportBackground: false,
    gridSize: 50,
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
    font_family: 'Arial',
    viewBackgroundColor: 'rgba(255,255,255,1)',
    zoom: {
      value: 1
    }
  };
  public freeShape: CoCanvasShape = {
    id: '6adfb34dCGfd7',
    type_enum: 'FREE_DRAW',
    free_draw: {
      startingPoint: [0, 0],
      lastCommittedPoint: [0, 0],
      points: []
    },
    line_width: this.canvas_state.currentStrokeWidth,
    stroke_color: 'yellow',
    isDragging: false,
    isSelected: false,
    touchOffsetX: 0,
    touchOffsetY: 0,
    shape_manager: this.shape_manager
  };
  constructor(public shapeService: WebsocketShapeService) {
    const body = document.querySelector('body');
    body?.setAttribute('style', 'overflow: hidden');
    window.addEventListener('storage', (event) => {
      if (event.key === 'shapes') {
        this.shapes = JSON.parse(localStorage.getItem('shapes') ?? '[]');
        this.drawAllShapes(this.shapes);
      }
    });
  }
  ngOnInit(): void {
    // this.fabricCanvas = new fabric.Canvas('co_canvas');
    // for (const shape of this.shapes) {
    //   switch (shape.type_enum) {
    //     case 'RECTANGLE':
    //       const rect = new fabric.Rect({
    //         left: shape.rectangle?.start_x,
    //         top: shape.rectangle?.start_y,
    //         fill: 'rgba(0,0,0,0)',
    //         stroke: shape.stroke_color,
    //         strokeWidth: shape.line_width,
    //         width: shape.rectangle?.end_x ?? 0 - (shape.rectangle?.start_x ?? 0),
    //         height: shape.rectangle?.end_y ?? 0 - (shape.rectangle?.start_y ?? 0),
    //         selectable: true
    //       });
    //       rect.set('data', {id: shape.id});
    //       rect.on('selected', (e: any) => {
    //         console.log('selected', e);
    //       });
    //       this.fabricCanvas.add(rect);
    //       break;

    //     case 'ELLIPSE':
    //       const ellipse = new fabric.Ellipse({
    //         left: shape.ellipse?.center_x,
    //         top: shape.ellipse?.center_y,
    //         fill: 'rgba(0,0,0,0)',
    //         stroke: shape.stroke_color,
    //         strokeWidth: shape.line_width,
    //         rx: shape.ellipse?.radius_x,
    //         ry: shape.ellipse?.radius_y,
    //         selectable: false
    //       });
    //       this.fabricCanvas.add(ellipse);
    //       break;

    //     case 'LINE':
    //       const line = new fabric.Line([shape.line?.start_x ?? 0, shape.line?.start_y ?? 0, shape.line?.end_x ?? 0, shape.line?.end_y ?? 0], {
    //         fill: shape.stroke_color,
    //         stroke: shape.stroke_color,
    //         strokeWidth: shape.line_width,
    //         selectable: false
    //       });
    //       this.fabricCanvas.add(line);
    //       break;
        
    //     case 'ARROW':
    //       const arrow = new fabric.Line([shape.arrow?.start_x ?? 0, shape.arrow?.start_y ?? 0, shape.arrow?.end_x ?? 0, shape.arrow?.end_y ?? 0], {
    //         fill: shape.stroke_color,
    //         stroke: shape.stroke_color,
    //         strokeWidth: shape.line_width,
    //         selectable: false
    //       });
    //       this.fabricCanvas.add(arrow);
    //       break;
    //   }
    // }
    console.log(this.fabricCanvas)
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    const canvasContainer = document.getElementById('canvas_container');
    console.log(this.tooled.enum)
    if(canvas) {
      this.infCanvas = canvas;
      this.ctx = this.infCanvas.getContext('2d');
      console.log(this.infCanvas.width, this.infCanvas.height)
      this.infCanvas.onmousedown = this.mouseDown();
      this.infCanvas.onmousemove = this.mouseMove();
      this.infCanvas.onmouseup = this.mouseUp();
      window.addEventListener('keydown', this.keyDown.bind(this));
      window.addEventListener('keyup', this.keyUp.bind(this));      
      if(localStorage) {
        this.shapes = JSON.parse(localStorage.getItem('shapes') ?? '[]');
        this.drawAllShapes(this.shapes);
      }
      else {
        this.drawAllShapes([])
      }
      this.ctx.beginPath();
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeStyle = 'rgba(1, 1, 203, 0.4)';
      for (let i = 0; i < this.infCanvas.width; i += this.canvas_state.gridSize) {
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(i, this.infCanvas.height);
      }
      for (let i = 0; i < this.infCanvas.height; i += this.canvas_state.gridSize) {
        this.ctx.moveTo(0, i);
        this.ctx.lineTo(this.infCanvas.width, i);
      }
      this.ctx.stroke();
      let scaleFactor = this.canvas_state.zoom.value;
      const zoomSensitivity = 0.1;
      const body = document.querySelector('body');
      if(body){
        body.onkeydown = (event: KeyboardEvent) => {
          if(event.key === 'z' && event.ctrlKey){
            this.shapes.pop();
            localStorage.setItem('shapes', JSON.stringify(this.shapes));
            this.drawAllShapes(this.shapes);
          }
        }
      }
      if(canvasContainer){
        canvasContainer.onwheel = (event: WheelEvent) => {
          if(!event.ctrlKey) {
            canvasContainer.scrollLeft += event.deltaY;
            canvasContainer.scrollTop += event.deltaX;
            this.drawAllShapes(this.shapes);
            return;
          }
          event.preventDefault();
          const delta = event.deltaY;
          const zoomIn = delta < 0;
          const zoomOut = delta > 0;
          if (zoomIn) {
            scaleFactor += zoomSensitivity;
            if(scaleFactor > 2) {
              scaleFactor = 2;
              return;
            }
          } else if (zoomOut) {
            scaleFactor -= zoomSensitivity;
            if(scaleFactor < 0.1) {
              scaleFactor = 0.1;
              return;
            }
          }
          this.canvas_state.zoom.value = scaleFactor;
          this.infCanvas.style.transform = `scale(${scaleFactor})`;
          console.log("zoomSens" ,zoomSensitivity, "scaleFac" , scaleFactor)
          console.log(event.deltaY)
        };
      }
    }
  }
  connectToShapeService(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.shapeService.connect().subscribe({
        next: async (data: any) => {
          console.log('Data from server: ', data.data);
          this.shapes = data.data;
          this.drawAllShapes(this.shapes);
          resolve();
        },
        error: async (error: any) => {
          console.error('Error from server: ', error);
          reject();
        }
      });
    })
  }
  ngViewAfterInit() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.infCanvas = new InfiniteCanvas(canvas);
    this.ctx = this.infCanvas.getContext('2d');
  }
  drawRectangle(x1: number, y1: number, x2: number, y2: number, shape: CoCanvasShape): void {
    if (this.ctx) {
      const startX = Math.min(x1, x2);
      const endX = Math.max(x1, x2);
      const startY = Math.min(y1, y2);
      const endY = Math.max(y1, y2);
      this.ctx.strokeStyle = shape.stroke_color;
      this.ctx.lineWidth = shape.line_width;
      const r = shape.rectangle?.roundness ?? 0;
      this.ctx.beginPath();
      this.ctx.moveTo(startX + r, startY);
      this.ctx.lineTo(endX - r, startY);
      this.ctx.quadraticCurveTo(endX, startY, endX, startY + r);
      this.ctx.lineTo(endX, endY - r);
      this.ctx.quadraticCurveTo(endX, endY, endX - r, endY);
      this.ctx.lineTo(startX + r, endY);
      this.ctx.quadraticCurveTo(startX, endY, startX, endY - r);
      this.ctx.lineTo(startX, startY + r);
      this.ctx.quadraticCurveTo(startX, startY, startX + r, startY);
      this.ctx.stroke();
    }
  }
  drawEllipse(x: number, y: number, shape: CoCanvasShape): void {
    if (this.ctx) {
      const radius_x = Math.abs(shape.ellipse?.radius_x ?? 0);
      const radius_y = Math.abs(shape.ellipse?.radius_y ?? 0);
      this.ctx.strokeStyle = shape.stroke_color;
      this.ctx.lineWidth = shape.line_width;
      this.ctx.beginPath();
      const rotation = 0;
      const startAngle = 0;
      const endAngle = 2 * Math.PI;
      this.ctx.ellipse(x, y, radius_x, radius_y, rotation, startAngle, endAngle);
      this.ctx.stroke();
    }
  }
  mouseDown() {
    return (e: MouseEvent) => {
      if(e.buttons === 2 || e.button === 4) {
        return;
      }
      switch(this.tooled.enum) {
        case 'RECTANGLE':
          this.infCanvas.style.cursor = 'crosshair';
          this.start_x = e.clientX;
          this.start_y = e.clientY;
          const rectShape: CoCanvasShape = {
            id: uuidv4(),
            type_enum: 'RECTANGLE',
            rectangle: {
              start_x: 0,
              start_y: 0,
              end_x: 0,
              end_y: 0,
              roundness: this.canvas_state.currentRoundness
            },
            line_width: this.canvas_state.currentStrokeWidth,
            stroke_color: this.canvas_state.currentStrokeColor,
            isDragging: false,
            isSelected: false,
            touchOffsetX: 0,
            touchOffsetY: 0,
            shape_manager: this.shape_manager
          }
          this.uuid = rectShape.id;
          this.shapes.push(rectShape);
          break;
        case 'ELLIPSE':
          this.infCanvas.style.cursor = 'crosshair';
          this.start_x = e.clientX;
          this.start_y = e.clientY;
          const ellipseShape: CoCanvasShape = {
            id: uuidv4(),
            type_enum: 'ELLIPSE',
            ellipse: {
              center_x: 0,
              center_y: 0,
              radius_x: 0,
              radius_y: 0
            },
            line_width: this.canvas_state.currentStrokeWidth,
            stroke_color: this.canvas_state.currentStrokeColor,
            isDragging: false,
            isSelected: false,
            touchOffsetX: 0,
            touchOffsetY: 0,
            shape_manager: this.shape_manager
          }
          this.uuid = ellipseShape.id;
          this.shapes.push(ellipseShape);
          break;
        case 'LINE':
          this.infCanvas.style.cursor = 'crosshair';
          this.start_x = e.clientX;
          this.start_y = e.clientY;
          const lineShape: CoCanvasShape = {
            id: uuidv4(),
            type_enum: 'LINE',
            line: {
              start_x: 0,
              start_y: 0,
              end_x: 0,
              end_y: 0,
              lineCap: 'round',
              lineJoin: 'round'
            },
            line_width: this.canvas_state.currentStrokeWidth,
            stroke_color: this.canvas_state.currentStrokeColor,
            isDragging: false,
            isSelected: false,
            touchOffsetX: 0,
            touchOffsetY: 0,
            shape_manager: this.shape_manager
          }
          this.uuid = lineShape.id;
          this.shapes.push(lineShape);
          break;
        case 'ARROW':
          this.infCanvas.style.cursor = 'crosshair';
          this.start_x = e.clientX;
          this.start_y = e.clientY;
          const arrowShape: CoCanvasShape = {
            id: uuidv4(),
            type_enum: 'ARROW',
            arrow: {
              start_x: 0,
              start_y: 0,
              end_x: 0,
              end_y: 0
            },
            line_width: this.canvas_state.currentStrokeWidth,
            stroke_color: this.canvas_state.currentStrokeColor,
            isDragging: false,
            isSelected: false,
            touchOffsetX: 0,
            touchOffsetY: 0,
            shape_manager: this.shape_manager
          }
          this.uuid = arrowShape.id;
          this.shapes.push(arrowShape);
          break;
      }
      this.infCanvas.addEventListener('contextmenu', (event: any) => {
        event.preventDefault();
      });
    }
  }
  mouseMove() {
    return (e: MouseEvent) => {
      if(e.buttons !== 1) {
        return;
      }
      switch(this.tooled.enum) {
        case 'RECTANGLE':
          if(e.buttons === 1) {
            this.infCanvas.style.cursor = 'crosshair';
            const rectShape = this.shapes.find(s => s.id === this.uuid);
            this.end_x = e.clientX;
            this.end_y = e.clientY;
            if(rectShape) {
              rectShape.rectangle = {
                start_x: this.start_x,
                start_y: this.start_y,
                end_x: this.end_x,
                end_y: this.end_y,
                roundness: this.canvas_state.currentRoundness
              }
              this.drawRectangle(rectShape.rectangle.start_x, rectShape.rectangle.start_y, rectShape.rectangle.end_x, rectShape.rectangle.end_y, rectShape);
            }
          }
          break;
        case 'ELLIPSE':
          if(e.buttons === 1) {
            this.infCanvas.style.cursor = 'crosshair';
            const ellipseShape = this.shapes.find(s => s.id === this.uuid);
            this.end_x = e.clientX;
            this.end_y = e.clientY;
            if(ellipseShape) {
              ellipseShape.ellipse = {
                center_x: this.start_x,
                center_y: this.start_y,
                radius_x: this.end_x - this.start_x,
                radius_y: this.end_y - this.start_y
              }
              this.drawEllipse(ellipseShape.ellipse.center_x, ellipseShape.ellipse.center_y, ellipseShape);
            }
          }
          break;
        case 'LINE':
          if(e.buttons === 1) {
            this.infCanvas.style.cursor = 'crosshair';
            const lineShape = this.shapes.find(s => s.id === this.uuid);
            this.end_x = e.clientX;
            this.end_y = e.clientY;
            if(lineShape) {
              lineShape.line = {
                start_x: this.start_x,
                start_y: this.start_y,
                end_x: this.end_x,
                end_y: this.end_y,
                lineCap: 'round',
                lineJoin: 'round'
              }
              this.drawLine(lineShape.line.start_x, lineShape.line.start_y, lineShape);
            }
          }
          break;
        case 'ARROW':
          if(e.buttons === 1) {
            this.infCanvas.style.cursor = 'crosshair';
            const arrowShape = this.shapes.find(s => s.id === this.uuid);
            this.end_x = e.clientX;
            this.end_y = e.clientY;
            if(arrowShape) {
              arrowShape.arrow = {
                start_x: this.start_x,
                start_y: this.start_y,
                end_x: this.end_x,
                end_y: this.end_y
              }
              this.drawArrow(arrowShape.arrow.start_x, arrowShape.arrow.start_y, arrowShape);
            }
          }
          break;
      }
    }
  }
  mouseUp() {
    return (e: MouseEvent) => {
      if(e.button === 2) {
        return;
      }
      switch(this.tooled.enum) {
        case 'RECTANGLE':
          const rectShape = this.shapes.find(s => s.id === this.uuid);
          if(rectShape?.rectangle) {
            if(rectShape.rectangle.start_x === rectShape.rectangle.end_x && rectShape.rectangle.start_y === rectShape.rectangle.end_y) {
              this.shapes = this.shapes.filter(s => s.id !== this.uuid);
              return;
            }
          }
          localStorage.setItem('shapes', JSON.stringify(this.shapes));
          break;
        case 'ELLIPSE':
          const ellipseShape = this.shapes.find(s => s.id === this.uuid);
          if(ellipseShape?.ellipse) {
            if(ellipseShape.ellipse.radius_x === 0 && ellipseShape.ellipse.radius_y === 0) {
              this.shapes = this.shapes.filter(s => s.id !== this.uuid);
              return;
            }
          }
          localStorage.setItem('shapes', JSON.stringify(this.shapes));
          break;
        case 'LINE':
          const lineShape = this.shapes.find(s => s.id === this.uuid);
          if(lineShape?.line) {
            if(lineShape.line.start_x === lineShape.line.end_x && lineShape.line.start_y === lineShape.line.end_y) {
              this.shapes = this.shapes.filter(s => s.id !== this.uuid);
              return;
            }
          }
          localStorage.setItem('shapes', JSON.stringify(this.shapes));
          break;
        case 'ARROW':
          const arrowShape = this.shapes.find(s => s.id === this.uuid);
          if(arrowShape?.arrow) {
            if(arrowShape.arrow.start_x === arrowShape.arrow.end_x && arrowShape.arrow.start_y === arrowShape.arrow.end_y) {
              this.shapes = this.shapes.filter(s => s.id !== this.uuid);
              return;
            }
          }
          localStorage.setItem('shapes', JSON.stringify(this.shapes));
          break;
      }
    }
  }
  keyDown(e: KeyboardEvent) {
    if(e.key === ' ') {
      this.tooled = tools[6];
      this.infCanvas.style.cursor = 'grab';
      console.log("space bar down")
      this.isPanning = true;
      this.panCanvas();
    }
  }
  keyUp(e: KeyboardEvent) {
    if(e.key === ' ') {
      this.infCanvas.style.cursor = 'crosshair';
      console.log("space bar up")
      this.isPanning = false;
      this.infCanvas.onmousedown = this.mouseDown();
      this.infCanvas.onmousemove = this.mouseMove();
      this.infCanvas.onmouseup = this.mouseUp();
    }
  }
  panCanvas() {
    this.tooled = tools[6];
    if(this.isPanning) {
      this.infCanvas.style.cursor = 'grabbing';
      this.infCanvas.onmousedown = (e: MouseEvent) => {
        this.start_x = e.clientX;
        this.start_y = e.clientY;
      }
      this.infCanvas.onmousemove = (e: MouseEvent) => {
        if(e.buttons === 1) {
          const dx = e.clientX - this.start_x;
          const dy = e.clientY - this.start_y;
        }
      }
      this.infCanvas.onmouseup = (e: MouseEvent) => {
        this.infCanvas.style.cursor = 'grab';
        this.drawAllShapes(this.shapes); 
        localStorage.setItem('shapes', JSON.stringify(this.shapes));
        this.isPanning = false;
        this.infCanvas.onmousedown = this.mouseDown();
        this.infCanvas.onmousemove = this.mouseMove();
        this.infCanvas.onmouseup = this.mouseUp();
        return; 
      }
    }
  }
  mouseInsideShape(x: number, y: number, shape: CoCanvasShape): boolean {
    switch (shape.type_enum) {
      case 'RECTANGLE':
        if (x >= (shape.rectangle?.start_x ?? 0) && x <= (shape.rectangle?.end_x ?? 0) && y >= (shape.rectangle?.start_y ?? 0) && y <= (shape.rectangle?.end_y ?? 0)) {
          return true;
        }
        break;
      case 'ELLIPSE':
        const radius_x = Math.abs(shape.ellipse?.radius_x ?? 0);
        const radius_y = Math.abs(shape.ellipse?.radius_y ?? 0);
        if (Math.pow(x - (shape.ellipse?.center_x ?? 0), 2) / Math.pow(radius_x, 2) + Math.pow(y - (shape.ellipse?.center_y ?? 0), 2) / Math.pow(radius_y, 2) <= 1) {
          return true;
        }
        break;
      case 'LINE':
        const x1 = shape.line?.start_x ?? 0;
        const y1 = shape.line?.start_y ?? 0;
        const x2 = shape.line?.end_x ?? 0;
        const y2 = shape.line?.end_y ?? 0;
        const dx = x2 - x1;
        const dy = y2 - y1;
        if (Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / Math.sqrt(dy * dy + dx * dx) <= 5) {
          return true;
        }
        break;
    }

    return false;
  }
  drawAllShapes(shapes: CoCanvasShape[]): void {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, Infinity, Infinity);
      for (let shape of shapes) {
        switch (shape.type_enum) {
          case 'FREE_DRAW':
            // for every point in the free draw, use function drawFreeDraw
            // for (let i = 0; i < (shape.free_draw?.points.length ?? 0); i++) {
            //   this.drawFreeDraw(shape.free_draw?.points[i][0] ?? 0, shape.free_draw?.points[i][1] ?? 0, shape);
            // }
            break;
          case 'RECTANGLE':
            this.drawRectangle(shape.rectangle?.start_x ?? 0, shape.rectangle?.start_y ?? 0, shape.rectangle?.end_x ?? 0, shape.rectangle?.end_y ?? 0, shape);
            break;
          case 'ELLIPSE':
            this.drawEllipse(shape.ellipse?.center_x ?? 0, shape.ellipse?.center_y ?? 0, shape);
            // this.drawingService.drawEllipse(shape.ellipse?.center_x ?? 0, shape.ellipse?.center_y ?? 0, shape);
            break;
          case 'LINE':
            this.drawLine(shape.line?.start_x ?? 0, shape.line?.start_y ?? 0, shape);
            // this.drawingService.drawLine(shape.line?.start_x ?? 0, shape.line?.start_y ?? 0, shape);
            break;
          case 'ARROW':
            this.drawArrow(shape.arrow?.start_x ?? 0, shape.arrow?.start_y ?? 0, shape);
            // this.drawingService.drawArrow(shape.arrow?.start_x ?? 0, shape.arrow?.start_y ?? 0, shape);
            break
          case 'TEXT':
            this.ctx.font = `${shape.text?.font_size}px Arial`;
            this.ctx.fillStyle = shape.stroke_color;
            this.ctx.fillText(shape.text?.text ?? '', shape.text?.start_x ?? 0, shape.text?.start_y ?? 0);
            break;
        }
      }
    }
  }
  drawFreeDraw(x: number, y: number, shape: CoCanvasShape): void {
    if (this.ctx) {
        const points = shape.free_draw?.points ?? [];
        const numPoints = points.length;
        // Start drawing immediately when there are no points
        if (numPoints === 0) {
            this.ctx.moveTo(x, y);
            points.push([x, y]);
            this.ctx.stroke();
        } else if (numPoints === 1) {
            // Draw a line to the current point
            const lastPoint = points[numPoints - 1];
            this.ctx.beginPath();
            this.ctx.moveTo(lastPoint[0], lastPoint[1]);
            this.ctx.lineTo(x, y);
            this.ctx.strokeStyle = shape.stroke_color;
            this.ctx.lineWidth = shape.line_width;
            this.ctx.lineJoin = 'round';
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
            points.push([x, y]);
        } else {
            // Draw a quadratic curve with the starting point
            const lastPoint = points[numPoints - 1];
            const controlX = (lastPoint[0] + x) / 2;
            const controlY = (lastPoint[1] + y) / 2;
            this.ctx.beginPath();
            this.ctx.moveTo(lastPoint[0], lastPoint[1]);
            this.ctx.quadraticCurveTo(lastPoint[0], lastPoint[1], controlX, controlY);
            this.ctx.strokeStyle = shape.stroke_color;
            this.ctx.lineWidth = shape.line_width;
            this.ctx.lineJoin = 'round';
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
            points.push([x, y]);
        }
        // store the lastCommittedPoint
    }
  }
  // drawFreeDraw(x: number, y: number, shape: CoCanvasShape): void {
  //   if (this.ctx) {
  //       if ((shape.free_draw?.points.length) === 0) {
  //           // Start drawing immediately when there are no points
  //           this.ctx.moveTo(x, y);
  //           shape.free_draw?.points.push([x, y]);
  //           this.ctx.stroke();
  //       } else {
  //           const points = shape.free_draw?.points ?? [];
  //           const numPoints = points.length;
  //           if (numPoints >= 3) {
  //               const cp1x = points[numPoints - 2][0] ?? 0;
  //               const cp1y = points[numPoints - 2][1] ?? 0;
  //               const cp2x = x;
  //               const cp2y = y;

  //               const p1x = points[numPoints - 3][0] ?? 0;
  //               const p1y = points[numPoints - 3][1] ?? 0;
  //               const p2x = points[numPoints - 1][0] ?? 0;
  //               const p2y = points[numPoints - 1][1] ?? 0;

  //               this.ctx.moveTo(p1x, p1y);
  //               this.ctx.strokeStyle = shape.stroke_color;
  //               this.ctx.lineWidth = shape.line_width;
  //               this.ctx.lineJoin = 'round';
  //               this.ctx.lineCap = 'round';
  //               this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2x, p2y);
  //           } else {
  //               const p = points[points.length - 1];
  //               const lastPoint = p;
  //               const controlX = (lastPoint[0] + x) / 2;
  //               const controlY = (lastPoint[1] + y) / 2;
  //               this.ctx.quadraticCurveTo(lastPoint[0], lastPoint[1], controlX, controlY);
  //           }
  //           shape.free_draw?.points.push([x, y]);
  //           this.ctx.stroke();
  //       }
  //   }
  //   // this.collabDraw();
  // }
  drawLine(x: number, y: number, shape: CoCanvasShape): void {
    if (this.ctx) {
      this.ctx.strokeStyle = shape.stroke_color;
      this.ctx.lineWidth = shape.line_width;
      this.ctx.beginPath();
      this.ctx.moveTo(shape.line?.start_x ?? 0, shape.line?.start_y ?? 0);
      this.ctx.lineTo(shape.line?.end_x ?? 0, shape.line?.end_y ?? 0);
      this.ctx.stroke();
    }
  }
  drawArrow(x: number, y: number, shape: CoCanvasShape): void {
    if (this.ctx) {
      const tox = shape.arrow?.end_x ?? 0;
      const toy = shape.arrow?.end_y ?? 0;
      const fromx = shape.arrow?.start_x ?? 0;
      const fromy = shape.arrow?.start_y ?? 0;
      var headlen = 10;
      var angle = Math.atan2(toy-fromy,tox-fromx);
      this.ctx.strokeStyle = shape.stroke_color;
      this.ctx.lineWidth = shape.line_width;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(fromx, fromy);
      this.ctx.lineTo(tox, toy);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(tox, toy);
      this.ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                  toy-headlen*Math.sin(angle-Math.PI/7));
      this.ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
                  toy-headlen*Math.sin(angle+Math.PI/7));
      this.ctx.lineTo(tox, toy);
      this.ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                  toy-headlen*Math.sin(angle-Math.PI/7));
      this.ctx.stroke();
      this.ctx.restore();
    }
  }
  eraseShape(x: number, y: number, shape:CoCanvasShape): void {
    if (this.ctx) {
      const mouseX = x;
      const mouseY = y;
      const shapeIndex = this.shapes.findIndex(s => this.mouseInsideShape(mouseX, mouseY, s));
      if (shapeIndex !== -1) {
        this.shapes.splice(shapeIndex, 1);
        this.drawAllShapes(this.shapes);
      }
    }
  }
  getControlPoints(points: [x: number, y: number][]): [x: number, y: number][] {
    const controlPoints: [x: number, y: number][] = [];
    for (let i = 1; i < points.length - 1; i++) {
        const p0 = i > 0 ? points[i - 1] : points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = i < points.length - 2 ? points[i+2] : p2;

        const t = 0.5; // tension paramenter

        const controlX1 = p1[0] + (p2[0] - p0[0]) * t;
        const controlY1 = p1[1] + (p2[1] - p0[1]) * t;
        const controlX2 = p2[0] - (p3[0] - p1[0]) * t;
        const controlY2 = p2[1] - (p3[1] - p1[1]) * t;

        controlPoints.push([controlX1, controlY1], [controlX2, controlY2]);
    }
    return controlPoints;
  }
}
