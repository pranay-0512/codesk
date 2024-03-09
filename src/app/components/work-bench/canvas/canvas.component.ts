import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import InfiniteCanvas from 'ef-infinite-canvas'
import { CoCanvasShape } from 'src/app/_models/work-bench/canvas/canvas-shape.model';
import { CoCanvasState } from 'src/app/_models/work-bench/canvas/canvas-state.model';
import { ToolsComponent } from '../overlay-components/tools/tools.component';
import { CoCanvasTool, tools } from 'src/app/_models/work-bench/canvas/canvas-tool.model';
import { WebsocketShapeService } from 'src/app/_services/websocket/websocket-shape.service';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @Input() selectedTool: CoCanvasTool = tools[2];
  public tooled = tools[6]; 
  // public tooled = tools[6]; 
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
    theme: 'dark',
    currentFillStyle: 'rgba(0,0,0,0)',
    currentFontFamily: 0,
    currentFontSize: 16,
    currentOpacity: 1,
    currentRoughness: 1,
    currentStrokeColor: 'white',
    currentRoundness: 0,
    currentStrokeStyle: 'solid',
    currentStrokeWidth: 2,
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
      points: []
    },
    line_width: this.canvas_state.currentStrokeWidth,
    stroke_color: 'pink',
    isDragging: false,
    isSelected: false,
    touchOffsetX: 0,
    touchOffsetY: 0,
    shape_manager: this.shape_manager
  };
  public rectShape: CoCanvasShape = {
    id: '6adfb34dCGfd7',
    type_enum: 'RECTANGLE',
    rectangle: {
      start_x: 0,
      start_y: 0,
      width: 0,
      height: 0
    },
    line_width: this.canvas_state.currentStrokeWidth,
    stroke_color: 'blue',
    isDragging: false,
    isSelected: false,
    touchOffsetX: 0,
    touchOffsetY: 0,
    shape_manager: this.shape_manager
  };
  public ellipseShape: CoCanvasShape = {
    id: '6adfb34dCGfd7',
    type_enum: 'ELLIPSE',
    ellipse: {
      center_x: 0,
      center_y: 0,
      radius_x: 0,
      radius_y: 0
    },
    line_width: this.canvas_state.currentStrokeWidth,
    stroke_color: 'green',
    isDragging: false,
    isSelected: false,
    touchOffsetX: 0,
    touchOffsetY: 0,
    shape_manager: this.shape_manager
  };
  public lineShape: CoCanvasShape = {
    id: '6adfb34dCGfd7',
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
  };
  public arrowShape: CoCanvasShape = {
    id: '6adfb34dCGfd7',
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
  };
  public textShape: CoCanvasShape = {
    id: '6adfb34dCGfd7',
    type_enum: 'TEXT',
    text: {
      text: 'Hello World',
      start_x: 0,
      start_y: 0,
      font_size: '16'
    },
    line_width: this.canvas_state.currentStrokeWidth,
    stroke_color: this.canvas_state.currentStrokeColor,
    isDragging: false,
    isSelected: false,
    touchOffsetX: 0,
    touchOffsetY: 0,
    shape_manager: this.shape_manager
  };
  constructor(public shapeService: WebsocketShapeService) {
    const body = document.querySelector('body');
    body?.setAttribute('style', 'overflow: hidden');
  }
  connectToShapeService(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.shapeService.connect().subscribe({
        next: async (data: any) => {
          console.log('Data from server: ', data.data);
          this.shapes = data.data;
          this.drawAllShape(this.shapes);
          resolve();
        },
        error: async (error: any) => {
          console.error('Error from server: ', error);
          reject();
        }
      });
    })
  }
  ngOnInit(): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      console.log(e);
      console.log('right click');
    });
    this.connectToShapeService().then(() => {
      console.log('Connected to shape service');
    }).catch(() => {
      console.error('Failed to connect to shape service');
    });
    window.addEventListener('storage', (e) => {
      if(e.key === 'shapes') {
        this.shapeService.sendMessage({type: 'SHAPE', data: JSON.parse(e.newValue ?? '[]')});
        this.shapes = JSON.parse(e.newValue ?? '[]');
        this.drawAllShape(this.shapes);
      }
    });
  }
  ngAfterViewInit(): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    canvas.onmousedown = this.mouseDown();
    canvas.onmousemove = this.mouseMove();
    canvas.onmouseup = this.mouseUp();
    if(localStorage && localStorage.getItem('shapes')) {
      this.shapes = JSON.parse(localStorage.getItem('shapes') ?? '[]');
      this.drawAllShape(this.shapes);
    }
    else {
      this.drawAllShape(this.shapes)
    }
  }
  mouseDown() {
    return (e: MouseEvent) => {
      const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
      if (e.buttons === 2) {
        return; // Do nothing if the right mouse button was clicked
      }
      switch (this.tooled.enum) {
        case 'SELECT_TOOL':
          canvas.style.cursor = 'grabbing';
          this.start_x = e.clientX;
          this.start_y = e.clientY;
          const mouseX = e.clientX;
          const mouseY = e.clientY;
          const shapeIndex = this.shapes.findIndex(s => this.mouseInsideShape(mouseX, mouseY, s));
          if (shapeIndex !== -1) {
            this.selected_shape = this.shapes[shapeIndex];
            this.selected_shape.isDragging = true;
            this.selected_shape.isSelected = true;
          }
          break;
        case 'FREE_DRAW':
          canvas.style.cursor = 'crosshair';
          this.freeShape.free_draw?.points.push({x: e.clientX, y: e.clientY});
          // this.shapes.push(this.freeShape);
          break;
        case 'RECTANGLE':
          canvas.style.cursor = 'crosshair';
          this.start_x = e.clientX;
          this.start_y = e.clientY;
          this.rectShape.id = '54ffb34dCGfd7';
          this.rectShape.rectangle = {
            start_x: this.start_x,
            start_y: this.start_y,
            width: 0,
            height: 0
          }
          this.shapes = [...this.shapes, this.rectShape];
          break;
        case 'ELLIPSE':
          canvas.style.cursor = 'crosshair';
          this.start_x = e.clientX;
          this.start_y = e.clientY;
          this.ellipseShape.id = '54ffb34dCGfd7';
          this.ellipseShape.ellipse = {
            center_x: this.start_x,
            center_y: this.start_y,
            radius_x: 0,
            radius_y: 0
          }
          this.shapes = [...this.shapes, this.ellipseShape];
          break;
        case 'LINE':
          canvas.style.cursor = 'crosshair';
          this.start_x = e.clientX;
          this.start_y = e.clientY;
          this.lineShape.id = '54ffb34dCGfd7';
          this.lineShape.line = {
            start_x: this.start_x,
            start_y: this.start_y,
            end_x: this.start_x,
            end_y: this.start_y,
            lineCap: 'round',
            lineJoin: 'round'
          }
          this.shapes.push(this.lineShape);
          break;
        case 'ARROW':
          canvas.style.cursor = 'crosshair';
          this.start_x = e.clientX;
          this.start_y = e.clientY;
          this.arrowShape.id = '54ffb34dCGfd7';
          this.arrowShape.arrow = {
            start_x: this.start_x,
            start_y: this.start_y,
            end_x: this.start_x,
            end_y: this.start_y
          }
          this.shapes.push(this.arrowShape);
          break; 
      } 
      canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });    
    }
  }
  mouseMove() {
    return (e: MouseEvent) => {
      const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
      if (e.button === 2) {
        return; // Do nothing if the right mouse button was clicked
      }
      switch (this.tooled.enum) {
        case 'SELECT_TOOL':
          break;
        case 'FREE_DRAW':
          if (e.buttons === 1) {
            canvas.style.cursor = 'crosshair';
            this.drawFreeDraw(e.clientX, e.clientY, this.freeShape);
            // this.drawAllShape(this.shapes);
          }
          break;
        case 'RECTANGLE':
          if (e.buttons === 1) {
            canvas.style.cursor = 'crosshair';
            this.rectShape.rectangle = {
              start_x: this.start_x,
              start_y: this.start_y,
              width: e.clientX - this.start_x,
              height: e.clientY - this.start_y
            };
            this.drawAllShape(this.shapes);
          }
          break;
        case 'ELLIPSE':
          if (e.buttons === 1) {
            canvas.style.cursor = 'crosshair';
            this.ellipseShape.ellipse = {
              center_x: this.start_x,
              center_y: this.start_y,
              radius_x: e.clientX - this.start_x,
              radius_y: e.clientY - this.start_y
            };
            this.drawAllShape(this.shapes);
          }
          break;
        case 'LINE':
          if (e.buttons === 1) {
            canvas.style.cursor = 'crosshair';
            this.lineShape.line = {
              start_x: this.start_x,
              start_y: this.start_y,
              end_x: e.clientX,
              end_y: e.clientY,
              lineCap: 'round',
              lineJoin: 'round'
            };
            // this.collabDraw();
            this.drawAllShape(this.shapes);
          }
          break;
        case 'ARROW':
          if (e.buttons === 1) {
            canvas.style.cursor = 'crosshair';
            this.arrowShape.arrow = {
              start_x: this.start_x,
              start_y: this.start_y,
              end_x: e.clientX,
              end_y: e.clientY
            };
            // this.collabDraw();
            this.drawAllShape(this.shapes);
          }
          break;
        case 'PAN':
          canvas.style.cursor = 'grab';
          break;
      }
    }
  }
  mouseUp() {
    return (e: MouseEvent) => {
      const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
      if (e.button === 2) {
        return; // Do nothing if the right mouse button was clicked
      }
      localStorage.setItem('shapes', JSON.stringify(this.shapes));
      switch (this.tooled.enum) {
        case 'FREE_DRAW':
          canvas.style.cursor = 'default';
          this.start_x = e.clientX;
          this.start_y = e.clientY;
          this.drawFreeDraw(e.clientX, e.clientY, this.freeShape);
          break;
        case 'RECTANGLE':
          canvas.style.cursor = 'default';
          this.drawRectangle(this.start_x, this.start_y, this.rectShape);
          this.shapes.push(this.rectShape);
          window.location.reload();
          break;
        case 'ELLIPSE':
          canvas.style.cursor = 'default';
          this.drawEllipse(this.start_x, this.start_y, this.ellipseShape);
          this.shapes.push(this.ellipseShape);
          window.location.reload();
          break;
        case 'LINE':
          canvas.style.cursor = 'default';
          this.drawLine(this.start_x, this.start_y, this.lineShape);
          this.shapes.push(this.lineShape);
          window.location.reload();
          break;
        case 'ARROW':
          canvas.style.cursor = 'default';
          this.drawArrow(this.start_x, this.start_y, this.arrowShape);
          this.shapes.push(this.arrowShape);
          window.location.reload();
          break;
        case 'SELECT_TOOL':
          if(this.selected_shape){
            const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
            canvas.style.cursor = 'grab';
            this.selected_shape.isDragging = false;
            this.selected_shape.isSelected = false;
          }
          break;
        case 'PAN':
          canvas.style.cursor = 'grab';
          break;
      }
    }
  }
  mouseInsideShape(x: number, y: number, shape: CoCanvasShape): boolean {
    switch (shape.type_enum) {
      case 'RECTANGLE':
        if (x > (shape.rectangle?.start_x ?? 0) && x < (shape.rectangle?.start_x ?? 0) + (shape.rectangle?.width ?? 0) && y > (shape.rectangle?.start_y ?? 0) && y < (shape.rectangle?.start_y ?? 0) + (shape.rectangle?.height ?? 0)) {
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
  drawAllShape(shapes: CoCanvasShape[]): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    if (ctx) {
      for (let shape of shapes) {
        switch (shape.type_enum) {
          case 'RECTANGLE':
            this.drawRectangle(shape.rectangle?.start_x ?? 0, shape.rectangle?.start_y ?? 0, shape);
            break;
          case 'ELLIPSE':
            this.drawEllipse(shape.ellipse?.center_x ?? 0, shape.ellipse?.center_y ?? 0, shape);
            break;
          case 'LINE':
            this.drawLine(shape.line?.start_x ?? 0, shape.line?.start_y ?? 0, shape);
            break;
          case 'ARROW':
            this.drawArrow(shape.arrow?.start_x ?? 0, shape.arrow?.start_y ?? 0, shape);
            break
          case 'FREE_DRAW':
            for (let i = 0; i < (shape.free_draw?.points.length ?? 0); i++) {
              this.drawFreeDraw(shape.free_draw?.points[i].x ?? 0, shape.free_draw?.points[i].y ?? 0, shape);
            }
            break;
          case 'TEXT':
            ctx.font = `${shape.text?.font_size}px Arial`;
            ctx.fillStyle = shape.stroke_color;
            ctx.fillText(shape.text?.text ?? '', shape.text?.start_x ?? 0, shape.text?.start_y ?? 0);
            break;
          case 'ERASER':
            const mouseX = shape.eraser?.mouse_x ?? 0;
            const mouseY = shape.eraser?.mouse_y ?? 0;
            const shapeIndex = shapes.findIndex(s => this.mouseInsideShape(mouseX, mouseY, s));
            if (shapeIndex !== -1) {
              shapes.splice(shapeIndex, 1);
              this.drawAllShape(shapes);
            }
            break;
        }
      }
    }
  }
  drawFreeDraw(x: number, y: number, shape: CoCanvasShape): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.beginPath();
        if ((shape.free_draw?.points.length) === 0) {
            // Start drawing immediately when there are no points
            ctx.moveTo(x, y);
            shape.free_draw?.points.push({ x, y });
            ctx.stroke();
        } else {
            const points = shape.free_draw?.points ?? [];
            const numPoints = points.length;
            if (numPoints >= 3) {
                const cp1x = points[numPoints - 2].x;
                const cp1y = points[numPoints - 2].y;
                const cp2x = x;
                const cp2y = y;

                const p1x = points[numPoints - 3].x;
                const p1y = points[numPoints - 3].y;
                const p2x = points[numPoints - 1].x;
                const p2y = points[numPoints - 1].y;

                ctx.moveTo(p1x, p1y);
                ctx.strokeStyle = shape.stroke_color;
                ctx.lineWidth = shape.line_width;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2x, p2y);
            } else {
                const p = points[points.length - 1];
                const lastPoint = points[points.length - 1];
                const controlX = (lastPoint.x + x) / 2;
                const controlY = (lastPoint.y + y) / 2;
                ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, controlX, controlY);
            }
            shape.free_draw?.points.push({ x, y });
            ctx.stroke();
        }
    }
    // this.collabDraw();
  }
  drawRectangle(x: number, y: number, shape: CoCanvasShape): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // take care of negative height and width by chaging the radius to negative
      ctx.strokeStyle = shape.stroke_color;
      ctx.lineWidth = shape.line_width;
      ctx.beginPath();
      const radius = this.canvas_state.currentRoundness;
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + (shape.rectangle?.width ?? 0) - radius, y);
      ctx.quadraticCurveTo(x + (shape.rectangle?.width ?? 0), y, x + (shape.rectangle?.width ?? 0), y + radius);
      ctx.lineTo(x + (shape.rectangle?.width ?? 0), y + (shape.rectangle?.height ?? 0) - radius);
      ctx.quadraticCurveTo(x + (shape.rectangle?.width ?? 0), y + (shape.rectangle?.height ?? 0), x + (shape.rectangle?.width ?? 0) - radius, y + (shape.rectangle?.height ?? 0));
      ctx.lineTo(x + radius, y + (shape.rectangle?.height ?? 0));
      ctx.quadraticCurveTo(x, y + (shape.rectangle?.height ?? 0), x, y + (shape.rectangle?.height ?? 0) - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.stroke();
    }
    // this.collabDraw();
  }
  drawEllipse(x: number, y: number, shape: CoCanvasShape): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = shape.stroke_color;
      ctx.lineWidth = shape.line_width;
      ctx.beginPath();
      // take care of negative radius
      const radius_x = Math.abs(shape.ellipse?.radius_x ?? 0);
      const radius_y = Math.abs(shape.ellipse?.radius_y ?? 0);
      const rotation = 0;
      const startAngle = 0;
      const endAngle = 2 * Math.PI;
      const anticlockwise = false;
      ctx.ellipse(x, y, radius_x, radius_y, rotation, startAngle, endAngle, anticlockwise);
      ctx.stroke();
    }
  }
  drawLine(x: number, y: number, shape: CoCanvasShape): void {
    // draw line
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = shape.stroke_color;
      ctx.lineWidth = shape.line_width;
      ctx.beginPath();
      ctx.moveTo(shape.line?.start_x ?? 0, shape.line?.start_y ?? 0);
      ctx.lineTo(shape.line?.end_x ?? 0, shape.line?.end_y ?? 0);
      ctx.stroke();
    }
  }
  drawArrow(x: number, y: number, shape: CoCanvasShape): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const tox = shape.arrow?.end_x ?? 0;
      const toy = shape.arrow?.end_y ?? 0;
      const fromx = shape.arrow?.start_x ?? 0;
      const fromy = shape.arrow?.start_y ?? 0;
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
    }
  }
  eraseShape(x: number, y: number, shape:CoCanvasShape): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const mouseX = x;
      const mouseY = y;
      const shapeIndex = this.shapes.findIndex(s => this.mouseInsideShape(mouseX, mouseY, s));
      if (shapeIndex !== -1) {
        this.shapes.splice(shapeIndex, 1);
        this.drawAllShape(this.shapes);
      }
    }
  }
  // draw the shapes
  // save the shapes to local storage
  // drawFreeDraw(x: number, y: number): void {
  //   const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
  //   const ctx = canvas.getContext('2d');
  //   if (ctx) {
  //     ctx?.beginPath();
  //     if (this.freeShape.free_draw?.points.length === 0) {
  //       // Start drawing immediately when there are no points
  //       ctx.moveTo(x, y);
  //       this.freeShape.free_draw?.points.push({ x, y });
  //     } else {
  //       const p = this.freeShape.free_draw?.points ?? [];
  //       const lastPoint = p[p.length - 1];
  //       const controlX = (lastPoint.x + x) / 2;
  //       const controlY = (lastPoint.y + y) / 2;
  //       ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, controlX, controlY);
  //       this.freeShape.free_draw?.points.push({ x, y });
  //     }
  //     ctx.strokeStyle = this.freeShape.stroke_color;
  //     ctx.lineWidth = this.freeShape.line_width;
  //     ctx.lineJoin = 'round';
  //     ctx.lineCap = 'round';
  //     ctx.stroke();
  //   }
  // }
  // 
}
