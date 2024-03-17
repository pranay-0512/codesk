import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import * as FontFaceObserver from 'fontfaceobserver';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnChanges {
  @Input() clearCanvasMessage!: any;
  @Input() selectedTool: CoCanvasTool = tools[0];
  public fabricCanvas!: fabric.Canvas;
  public mouseDown: boolean = false;
  public clipboard: any = null;
  public isSelected: boolean = false;
  public isPanning: boolean = false;
  public canvasSize: any = {
    width: 0,
    height: 0
  }
  public canvas_state: CoCanvasState = {
    showWelcomeScreen: false,
    theme: 'light', 
    currentFillStyle: 'rgb(45, 45, 45, 0.05)',
    currentFontFamily: 0,
    currentFontSize: 32,
    currentOpacity: 1,
    currentRoughness: 1,
    currentStrokeColor: 'black',
    currentRoundness: 10,
    currentStrokeStyle: 'solid',
    currentStrokeWidth: 5,
    currentTextAlign: 'left',
    editingGroupId: null,
    activeTool: {
      type: 'SELECT',
      lastActiveTool: 'SELECTION'
    },
    exportBackground: false,
    gridSize: 100,
    name: 'co_canvas',
    scrolledOutside: false,
    relativeScrollX: 0,
    relativeScrollY: 0,
    selectedElementIds: {
      selectedElementIds: []
    },
    previousSelectedElementId: {
      selectedElementId: {
        elementId: ''
      }
    },
    shadow: {
      blur: 0,
      offsetX: 4,
      offsetY: 4,
      color: 'aqua',
    },
    font_family: 'comic sans ms',
    fonts: ['Sevillana', 'Combo', 'Gaegu'],
    viewBackgroundColor: 'rgba(0,0,0,1)',
    zoom: {
      value: 1
    }
  };
  constructor(public shapeService: WebsocketShapeService, public drawLine: LineService, public drawRectangle: RectangleService, public drawEllipse: EllipseService, public drawArrow: ArrowService, public drawFree: FreeDrawService) {
    const body = document.querySelector('body');
    body?.setAttribute('style', 'overflow: hidden');
    window.addEventListener('storage', (event) => {
      if (event.key === 'cocanvas_shapes') {
        this.getFromLocalStorage();
      }
      if (event.key === 'cocanvas_state') {
        this.canvas_state = JSON.parse(event.newValue ?? '{}');
      }
    });
  }
  ngOnInit(): void {
    this.initCanvas();
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
    this.canvas_state = localStorage.getItem('cocanvas_state') ? JSON.parse(localStorage.getItem('cocanvas_state') ?? '{}') : this.canvas_state;
    // set the canvas according to the state
    this.addCustomFonts();
    this.addMouseEvents(this.selectedTool);
    this.customSelectionBorder();
    this.addZoomEvent();
    this.setCanvas();
  }
  getFromLocalStorage(): void {
    const shapes = JSON.parse(localStorage.getItem('cocanvas_shapes') ?? '[]');
    this.fabricCanvas.loadFromJSON(shapes, () => {
      this.fabricCanvas.renderAll();
    });
  }
  addMouseEvents(tool: CoCanvasTool): void {
    switch(tool.enum) {
      case 'TEXT':
        this.fabricCanvas.selection = false;
        this.fabricCanvas.defaultCursor = 'text';
        this.fabricCanvas.hoverCursor = 'text';
        this.fabricCanvas.on('mouse:down', (e: any) => {
          const pointer = this.fabricCanvas.getPointer(e.e);
          const text = new fabric.IText('', {
            left: pointer.x,
            top: pointer.y,
            fontFamily: this.canvas_state.fonts?.[2] ?? 'Arial',
            fontSize: this.canvas_state.currentFontSize,
            fill: 'black',
            opacity: this.canvas_state.currentOpacity,
            textAlign: this.canvas_state.currentTextAlign,
            cursorColor: 'red',
            originX: 'center',
            originY: 'center',
            hasControls: false,
          });
          this.fabricCanvas.add(text);
          this.fabricCanvas.setActiveObject(text);
          text.enterEditing();
          text.hiddenTextarea?.focus();
          text.hiddenTextarea?.select();
          text.hiddenTextarea?.addEventListener('input', (e) => {
            text.set({ text: text.hiddenTextarea?.value });
            this.fabricCanvas.renderAll();
          });
          text.on('editing:exited', (e) => {
            this.selectedTool = tools[0];
            this.addMouseEvents(this.selectedTool);
            text.hiddenTextarea?.blur();
            this.fabricCanvas.renderAll();
          });
          localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
        });
        break;
      case 'PAN':
        this.fabricCanvas.selection = false;
        this.fabricCanvas.defaultCursor = 'grab';
        this.fabricCanvas.hoverCursor = 'grab';
        this.fabricCanvas.on('mouse:down', (e: any) => {
          this.mouseDown = true;
          this.isPanning = true;
          this.fabricCanvas.selection = false;
          if (this.fabricCanvas.getActiveObject()) {
            this.fabricCanvas.discardActiveObject().renderAll();
          }
          this.fabricCanvas.setCursor('grabbing');
        });
        this.fabricCanvas.on('mouse:move', (e: any) => {
          if (this.mouseDown && this.isPanning) {
            this.fabricCanvas.selection = false;
            this.fabricCanvas.setCursor('grabbing');
            if (this.fabricCanvas.getActiveObject()) {
              this.fabricCanvas.discardActiveObject().renderAll();
            }
            this.fabricCanvas.relativePan(new fabric.Point(e.e.movementX, e.e.movementY));
          }
        });
        this.fabricCanvas.on('mouse:up', (e: any) => {
          this.mouseDown = false;
          this.isPanning = false;
          this.fabricCanvas.selection = false;
          this.fabricCanvas.defaultCursor = 'grab';
          this.fabricCanvas.hoverCursor = 'grab';
        });
        break;
      case 'SELECT':
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
        window.addEventListener('keydown', (e) => {
          if (e.ctrlKey && e.key === 'c') {
            this.fabricCanvas.getActiveObject()?.clone((clonedObj: any) => {
              this.clipboard = clonedObj;
            });
          }
        });
        window.addEventListener('keydown', (e) => {
          if(e.ctrlKey && e.key === 'v') {
            if(!this.clipboard) return;
            console.log(this.clipboard)
            this.clipboard.clone((clonedObj: any) => {
              this.fabricCanvas.discardActiveObject();
              clonedObj.set({
                left: clonedObj.left + 300,
                top: clonedObj.top + 100,
                evented: true,
              });
              if (clonedObj.type === 'activeSelection') {
                clonedObj.canvas = this.fabricCanvas;
                clonedObj.forEachObject((obj: any) => {
                  this.fabricCanvas.add(obj);
                });
                clonedObj.setCoords();
              } else {
                this.fabricCanvas.add(clonedObj);
              }
              this.fabricCanvas.setActiveObject(clonedObj);
              this.fabricCanvas.requestRenderAll();
              localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
            });
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
        this.fabricCanvas.isDrawingMode = true;
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
  customSelectionBorder(): void {
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#ffc3c3',
      cornerStrokeColor: '#92f5ff',
      cornerStyle: 'circle',
      cornerSize: 12,
      padding: 10,
      borderColor: '#92f5ff',
      borderDashArray: [5, 5],
    });
  }
  addCustomFonts(): void {
    const fonts = this.canvas_state.fonts;
    var select = document.getElementById('font_family');
    if (select) {
      const canvas = this.fabricCanvas;
      fonts?.forEach((font) => {
        var option = document.createElement('option');
        option.text = font;
        option.value = font;
        select?.appendChild(option);
      });
      select.onchange = function() {
        if ((this as HTMLSelectElement).value !== 'Arial') {
          loadAndUse((this as HTMLSelectElement).value);
        } else {
          const activeObject = canvas.getActiveObject() as fabric.Textbox;
          activeObject?.set({ fontFamily: 'Arial' });
          canvas.requestRenderAll();
        }
      }
    }
    const loadAndUse = (font: any) => {
      const canvas = this.fabricCanvas; // Declare the 'canvas' variable
      var myfont = new FontFaceObserver(font)
      myfont.load()
        .then(function() {
          // when font is loaded, use it.
          const activeObject = canvas.getActiveObject() as fabric.Textbox; // Typecast activeObject to fabric.Textbox
          if (activeObject) {
            activeObject.set({ fontFamily: font }); // Use the correct syntax to set the fontFamily property
            canvas.requestRenderAll();
          }
        }).catch(function(e) {
          console.log(e)
          alert('font loading failed ' + font);
        });
    }
  }
  addZoomEvent(): void {
    const canvas = this.fabricCanvas;
    canvas.on('mouse:wheel', (opt) => {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 10) zoom = 10;
      if (zoom < 0.01) zoom = 0.01;
      this.canvas_state.zoom.value = zoom;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      localStorage.setItem('cocanvas_state', JSON.stringify(this.canvas_state));
      return false;
    });
  }
  setCanvas(): void {
    this.fabricCanvas.setZoom(this.canvas_state.zoom.value);
    console.log(this.fabricCanvas.getZoom());
    this.fabricCanvas.setBackgroundColor(this.canvas_state.viewBackgroundColor, () => {
      this.fabricCanvas.renderAll();
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['selectedTool']) {
      if(this.fabricCanvas) {
        this.selectedTool = changes['selectedTool'].currentValue;
        this.fabricCanvas.off('mouse:down');
        this.fabricCanvas.off('mouse:move');
        this.fabricCanvas.off('mouse:up');
        this.addMouseEvents(this.selectedTool);
        this.fabricCanvas.requestRenderAll();
      }
    }
  }
}
