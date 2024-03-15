import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CoCanvasShape } from 'src/app/_models/work-bench/canvas/canvas-shape.model';
import { CoCanvasState } from 'src/app/_models/work-bench/canvas/canvas-state.model';
import { CoCanvasTool, tools } from 'src/app/_models/work-bench/canvas/canvas-tool.model';
import { WebsocketShapeService } from 'src/app/_services/websocket/websocket-shape.service';
import { fabric } from 'fabric';
import { LineService } from 'src/app/_services/drawShapes/line/line.service';
import { RectangleService } from 'src/app/_services/drawShapes/rectangle/rectangle.service';
import { EllipseService } from 'src/app/_services/drawShapes/ellipse/ellipse.service';
import { ArrowService } from 'src/app/_services/drawShapes/arrow/arrow.service';
import { FreeDrawService } from 'src/app/_services/drawShapes/free-draw/free-draw.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @Input() selectedTool!: CoCanvasTool;
  @Input() clearCanvasMessage!: any;
  public fabricCanvas!: fabric.Canvas;
  public mouseDown: boolean = false;
  public canvasSize: any = {
    width: 0,
    height: 0
  }
  public canvas_state: CoCanvasState = {
    showWelcomeScreen: false,
    theme: 'light',
    currentFillStyle: 'rgba(255,0,0,0)',
    currentFontFamily: 0,
    currentFontSize: 16,
    currentOpacity: 1,
    currentRoughness: 1,
    currentStrokeColor: 'pink',
    currentRoundness: 10,
    currentStrokeStyle: 'solid',
    currentStrokeWidth: 5,
    currentTextAlign: 'left',
    editingGroupId: null,
    activeTool: {
      type: 'PAN',
      lastActiveTool: 'SELECTION'
    },
    exportBackground: false,
    gridSize: 100,
    name: 'co_canvas',
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
    shadow: {
      blur: 0,
      offsetX: 4,
      offsetY: 4,
      color: 'aqua',
    },
    font_family: 'Arial',
    viewBackgroundColor: 'rgba(255,255,255,1)',
    zoom: {
      value: 1
    }
  };
  public tooled = tools[6];
  constructor(public shapeService: WebsocketShapeService, public drawLine: LineService, public drawRectangle: RectangleService, public drawEllipse: EllipseService, public drawArrow: ArrowService, public drawFree: FreeDrawService) {
    const body = document.querySelector('body');
    body?.setAttribute('style', 'overflow: hidden');
    window.addEventListener('storage', (event) => {
      if (event.key === 'cocanvas_shapes') {
        this.getFromLocalStorage();
      }
    });
  }
  ngOnInit(): void {
    this.initCanvas();
    this.addMouseEvents();
  }
  initCanvas(): void {
    this.fabricCanvas = new fabric.Canvas('co_canvas', {
      width: screen.width,
      height: screen.height,
      selection: false,
      defaultCursor: 'default',
      hoverCursor: 'default'
    });
    this.getFromLocalStorage();
  }
  createGrid(): void {
    const grid = this.canvas_state.gridSize;
    const canvasWidth = screen.width;
    const canvasHeight = screen.height;
    this.fabricCanvas.selection = false;
    for (var i = 0; i < (canvasWidth / grid); i++) {
      this.fabricCanvas.add(new fabric.Line([i * grid, 0, i * grid, canvasHeight], { stroke: '#ccc', selectable: false, evented: false }));
    }
    for (var i = 0; i < (canvasHeight / grid); i++) {
      this.fabricCanvas.add(new fabric.Line([0, i * grid, canvasWidth, i * grid], { stroke: '#ccc', selectable: false, evented: false }));
    }
  }
  getFromLocalStorage(): void {
    const shapes = JSON.parse(localStorage.getItem('cocanvas_shapes') ?? '[]');
    this.fabricCanvas.loadFromJSON(shapes, () => {
      this.fabricCanvas.renderAll();
    });
  }
  addMouseEvents(): void {
    switch(this.tooled.enum) {
      case 'PAN':
        this.fabricCanvas.selection = false;
        this.fabricCanvas.defaultCursor = 'grab';
        this.fabricCanvas.hoverCursor = 'grab';
        this.fabricCanvas.on('mouse:down', (e: any) => {
          this.mouseDown = true;
          this.fabricCanvas.selection = false;
          this.fabricCanvas.setCursor('grabbing');
        });
        this.fabricCanvas.on('mouse:move', (e: any) => {
          if (this.mouseDown) {
            this.fabricCanvas.setCursor('grabbing');
            this.fabricCanvas.relativePan(new fabric.Point(e.e.movementX, e.e.movementY));
          }
        });
        this.fabricCanvas.on('mouse:up', (e: any) => {
          this.mouseDown = false;
          this.fabricCanvas.selection = true;
          this.fabricCanvas.defaultCursor = 'grab';
          this.fabricCanvas.hoverCursor = 'grab';
        });
        break;
      case 'SELECT_TOOL':
        this.fabricCanvas.selection = true;
        this.fabricCanvas.defaultCursor = 'default';
        this.fabricCanvas.hoverCursor = 'default';
        this.fabricCanvas.on('object:modified', (e: any) => {
          localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
        });
        window.addEventListener('keydown', (e) => {
          if (e.key === 'Delete') {
            this.fabricCanvas.remove(...this.fabricCanvas.getActiveObjects());
            localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
          }
        });
        break;
      case 'LINE':
        this.fabricCanvas.on('mouse:down', this.drawLine.startDrawingLine.bind(this));
        this.fabricCanvas.on('mouse:move', this.drawLine.keepDrawingLine.bind(this));
        this.fabricCanvas.on('mouse:up', this.drawLine.stopDrawingLine.bind(this));
        break;
      case 'RECTANGLE':
        this.fabricCanvas.on('mouse:down', this.drawRectangle.startDrawingRectangle.bind(this));
        this.fabricCanvas.on('mouse:move', this.drawRectangle.keepDrawingRectangle.bind(this));
        this.fabricCanvas.on('mouse:up', this.drawRectangle.stopDrawingRectangle.bind(this));
        break;
      case 'ELLIPSE':
        this.fabricCanvas.on('mouse:down', this.drawEllipse.startDrawingEllipse.bind(this));
        this.fabricCanvas.on('mouse:move', this.drawEllipse.keepDrawingEllipse.bind(this));
        this.fabricCanvas.on('mouse:up', this.drawEllipse.stopDrawingEllipse.bind(this));
        break;
      case 'ARROW':
        this.fabricCanvas.on('mouse:down', this.drawArrow.startDrawingArrow.bind(this));
        this.fabricCanvas.on('mouse:move', this.drawArrow.keepDrawingArrow.bind(this));
        this.fabricCanvas.on('mouse:up', this.drawArrow.stopDrawingArrow.bind(this));
        break;
      case 'FREE_DRAW':
        this.fabricCanvas.selection = false;
        this.fabricCanvas.defaultCursor = 'crosshair';
        this.fabricCanvas.hoverCursor = 'crosshair';
        this.fabricCanvas.isDrawingMode = true;
        this.fabricCanvas.freeDrawingBrush.width = this.canvas_state.currentStrokeWidth;
        this.fabricCanvas.freeDrawingBrush.color = this.canvas_state.currentStrokeColor;
        this.fabricCanvas.freeDrawingBrush.strokeLineCap = 'round';
        this.fabricCanvas.freeDrawingBrush.strokeLineJoin = 'round';
        this.fabricCanvas.freeDrawingBrush.shadow = new fabric.Shadow(this.canvas_state.shadow);
        this.fabricCanvas.on('path:created', (e: any) => {
          const path = e.path;
          path.set({data: {id: uuidv4()}});
          this.fabricCanvas.requestRenderAll();
          localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
        });
        break;
    }
  } 
}
