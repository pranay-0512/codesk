import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
import { ToolSelectedEvent } from '../work-bench.component';
import { Transform } from 'fabric/fabric-impl';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, OnChanges {
  @Input() clearCanvasMessage!: any;
  @Input() selectedTool: CoCanvasTool = tools[0];
  @Output() shapePropertiesChange = new EventEmitter<any>();
  @Output() toolSelected = new EventEmitter<ToolSelectedEvent>();
  public fabricCanvas!: fabric.Canvas;
  public mouseDown: boolean = false;
  public mouseMoving: boolean = false;
  public isPanning: boolean = false;
  public clipboard: any = null;
  public isSelected: boolean = false;
  public secondaryCursor: any;
  public subscriptionArray: any[] = [];
  public isTyping: boolean = false;
  public canvas_state: CoCanvasState = {
    showWelcomeScreen: false,
    theme: 'dark', 
    currentFillStyle: 'rgba(45, 45, 45, 0.05)',
    currentFontFamily: 0,
    currentFontSize: 48,
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
      lastActiveTool: 'SELECT'
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
      blur: 1,
      offsetX: 4,
      offsetY: 4,
      color: 'green',
    },
    font_family: 'comic sans ms',
    fonts: ['Sevillana', 'Combo', 'Gaegu'],
    viewBackgroundColor: 'black',
    zoom: {
      value: 1,
      offsetX: 0,
      offsetY: 0
    }
  };
  @Input() shapeProperties: any = {
    backgroundColor: this.canvas_state.currentFillStyle,
    strokeWidth: this.canvas_state.currentStrokeWidth,
    strokeColor: this.canvas_state.currentStrokeColor,
    opacity: this.canvas_state.currentOpacity,
    blur: this.canvas_state.shadow?.blur,
    offsetX: this.canvas_state.shadow?.offsetX,
    offsetY: this.canvas_state.shadow?.offsetY,
    shadowColor: this.canvas_state.shadow?.color
  };
  public theme: string = this.canvas_state.theme === 'light' ? 'rgb(255,255,0)' : 'rgba(0,0,0,1)';
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
    this.secondaryCursor = new fabric.Text('+', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 'red',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    });
    this.setCanvas();
    this.getFromLocalStorage();
    this.addCustomFonts();
    this.addMouseEvents(this.selectedTool);
    this.customSelectionBorder(); 
    this.addZoomEvent();
    this.addKeyEvents();
    this.addCustomControlPoints();
  }
  getFromLocalStorage(): void {
    const shapes = JSON.parse(localStorage.getItem('cocanvas_shapes') ?? '[]');
    this.fabricCanvas.loadFromJSON(shapes, () => {
      this.fabricCanvas.renderAll();
    });
  }
  customSelectionBorder(): void {
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#F4DF4EFF',
      cornerStrokeColor: '#949398FF',
      cornerStyle: 'circle',
      cornerSize: 8,
      padding: 10,
      borderColor: '#949398FF',
      borderDashArray: [20, 20],
      centeredScaling: false,
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
      const canvas = this.fabricCanvas;
      var myfont = new FontFaceObserver(font)
      myfont.load()
        .then(function() {
          const activeObject = canvas.getActiveObject() as fabric.Textbox;
          if (activeObject) {
            activeObject.set({ fontFamily: font });
          }
        }).catch(function(e) {
          alert('font loading failed ' + font);
        }); 
    }
  }
  addZoomEvent(): void {
    const canvas = this.fabricCanvas;
    canvas.on('mouse:wheel', (opt) => {
      var delta = opt.e.deltaY;
      if(delta>0) this.fabricCanvas.setCursor('zoom-out');
      else if (delta<0) this.fabricCanvas.setCursor('zoom-in');
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta; 
      if (zoom > 10) {zoom = 10}
      if (zoom < 0.05) {zoom = 0.05};
      this.canvas_state.zoom.value = zoom;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      localStorage.setItem('cocanvas_state', JSON.stringify(this.canvas_state));
    });
  }
  setCanvas(): void {
    this.canvas_state = localStorage.getItem('cocanvas_state') ? JSON.parse(localStorage.getItem('cocanvas_state') ?? '{}') : this.canvas_state;
    const zoom = this.canvas_state.zoom.value;
    const relScrollX = this.canvas_state.relativeScrollX;
    const relScrollY = this.canvas_state.relativeScrollY;
    this.fabricCanvas.setZoom(zoom);
    this.fabricCanvas.relativePan(new fabric.Point(relScrollX, relScrollY));
    this.selectedTool = tools.find((tool) => tool.enum === this.canvas_state.activeTool.type) ?? tools[0];
  }
  addMouseEvents(tool: CoCanvasTool): void {
    switch(tool.enum) {
      case 'TEXT':
        this.fabricCanvas.selection = false;
        this.fabricCanvas.discardActiveObject().renderAll();
        this.fabricCanvas.on('mouse:down', (e: any) => {
          this.isTyping = true;
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
          if (e.target) {
            const surrObject = e.target as fabric.Object;
            const surrObjectCenter = surrObject?.getCenterPoint();
            text.set({ left: surrObjectCenter.x, top: surrObjectCenter.y });
          }
          text.setCoords();
          this.fabricCanvas.add(text);
          this.fabricCanvas.setActiveObject(text);
          text.enterEditing();
          text.on('editing:entered', (e) => {
            this.isTyping = true;
            text.hiddenTextarea?.focus();
            text.hiddenTextarea?.select();
            text.hiddenTextarea?.addEventListener('input', (e) => {
              text.set({ text: text.hiddenTextarea?.value });
              this.fabricCanvas.renderAll();
            });
          })
          text.on('editing:exited', (e) => {
            this.isTyping = false;
            text.hiddenTextarea?.blur();
            this.fabricCanvas.renderAll();
            text.bringToFront();
            const selectTool = () => {
              this.selectedTool = tools[0];
              this.removeMouseEvents();
              this.addMouseEvents(this.selectedTool);
              this.canvas_state.activeTool.type = this.selectedTool.enum;
              localStorage.setItem('cocanvas_state', JSON.stringify(this.canvas_state));
            };
            selectTool();
          });
          localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
        });
        break;
      case 'PAN':
        this.fabricCanvas.selection = false;
        this.fabricCanvas.setCursor('grab');
        this.fabricCanvas.discardActiveObject().renderAll();
        this.fabricCanvas.on('mouse:down', (e: any) => {
          this.mouseDown = true;
          this.isPanning = true;
          this.fabricCanvas.setCursor('grabbing');
          this.fabricCanvas.selection = false;
          if (this.fabricCanvas.getActiveObject()) {
            this.fabricCanvas.discardActiveObject().renderAll();
          }
        });
        this.fabricCanvas.on('mouse:move', (e: any) => {
          this.mouseMoving = true;
          this.fabricCanvas.setCursor('grab');
          if (this.mouseDown && this.isPanning && this.mouseMoving) {
            this.fabricCanvas.setCursor('grabbing');
            this.fabricCanvas.selection = false;
            if (this.fabricCanvas.getActiveObject()) {
              this.fabricCanvas.discardActiveObject().renderAll();
            }
            this.canvas_state.relativeScrollX += e.e.movementX;
            this.canvas_state.relativeScrollY += e.e.movementY;
            this.fabricCanvas.relativePan(new fabric.Point(e.e.movementX, e.e.movementY));
          }
          else {
            this.fabricCanvas.setCursor('grab');
          }
        });
        this.fabricCanvas.on('mouse:up', (e: any) => {
          this.fabricCanvas.setCursor('grab');
          this.mouseDown = false;
          this.mouseMoving = false;
          this.isPanning = false;
          this.fabricCanvas.selection = false;
          this.fabricCanvas.renderAll();
          localStorage.setItem('cocanvas_state', JSON.stringify(this.canvas_state));
        });
        break;
      case 'SELECT':
        this.fabricCanvas.selection = true;
        this.fabricCanvas.setCursor('default');
        this.fabricCanvas.on('mouse:dblclick', (e: any) => {
          if (e.target) {
            const target = e.target as fabric.Object;
            target.sendToBack();
            this.fabricCanvas.renderAll();
          }
        })
        this.fabricCanvas.on('mouse:down', (e: any) => {
          this.mouseDown = true;
          if (e.target) {
            this.fabricCanvas.setCursor('move');
            this.addCustomControlPoints();
            if(this.fabricCanvas.getActiveObjects().length > 1) {
              return;
            }
            if (e.target.type === 'group' && e.target instanceof fabric.Group) {
              (e.target as fabric.Group).forEachObject((obj) => {
                this.shapeProperties = {
                  backgroundColor: obj.fill,
                  strokeWidth: obj.strokeWidth,
                  strokeColor: obj.stroke,
                  opacity: obj.opacity,
                  blur: (obj.shadow as fabric.Shadow)?.blur,
                  offsetX: (obj.shadow as fabric.Shadow)?.offsetX,
                  offsetY: (obj.shadow as fabric.Shadow)?.offsetY,
                  shadowColor: (obj.shadow as fabric.Shadow)?.color
                }
              });
            }
            else {
              this.shapeProperties = {
                backgroundColor: e.target.fill,
                strokeWidth: e.target.strokeWidth,
                strokeColor: e.target.stroke,
                opacity: e.target.opacity,
                blur: e.target.shadow?.blur,
                offsetX: e.target.shadow?.offsetX,
                offsetY: e.target.shadow?.offsetY,
                shadowColor: e.target.shadow?.color
              }
            }
            this.shapePropertiesChange.emit(this.shapeProperties);
          }
          if(e.e.buttons === 1) {
            // this.shapeService.sendMessage(e.pointer);
          }
        });
        this.fabricCanvas.on('mouse:move', (e)=> {
          this.fabricCanvas.defaultCursor = 'default';
          this.fabricCanvas.hoverCursor = 'default';
          this.mouseMoving = true;
          if(e.target) {
            this.fabricCanvas.hoverCursor = 'move';
          }
          // this.shapeService.sendMessage(e.pointer);
        })
        this.fabricCanvas.on('mouse:up', () => {
          this.mouseDown = false;
          this.mouseMoving = false;
          this.fabricCanvas.defaultCursor = 'default';
          this.fabricCanvas.hoverCursor = 'default';
          this.fabricCanvas.setCursor('default');
          this.fabricCanvas.selection = true;
          this.fabricCanvas.renderAll();
        })
        this.fabricCanvas.on('object:modified', () => {
          // this.shapeService.sendMessage(this.fabricCanvas);
          localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
        });
        break;
      case 'LINE':
        this.fabricCanvas.discardActiveObject().renderAll();
        this.fabricCanvas.setCursor('crosshair');
        this.fabricCanvas.on('mouse:down', this.drawLine.startDrawingLine.bind(this));
        this.fabricCanvas.on('mouse:move', this.drawLine.keepDrawingLine.bind(this));
        this.fabricCanvas.on('mouse:up', ()=> {
          this.drawLine.stopDrawingLine.bind(this)();
          const selectTool = () => {
            this.selectedTool = tools[0];
            this.removeMouseEvents();
            this.addMouseEvents(this.selectedTool);
            this.fabricCanvas.forEachObject((obj) => {
              obj.lockMovementX = false;
              obj.lockMovementY = false;
            });
            this.canvas_state.activeTool.type = this.selectedTool.enum;
            localStorage.setItem('cocanvas_state', JSON.stringify(this.canvas_state));
          };
          selectTool();
          this.addCustomControlPoints();
        }) 
        break;
      case 'RECTANGLE':
        this.fabricCanvas.discardActiveObject().renderAll();
        this.fabricCanvas.setCursor('crosshair');
        this.fabricCanvas.on('mouse:down', this.drawRectangle.startDrawingRectangle.bind(this));
        this.fabricCanvas.on('mouse:move', this.drawRectangle.keepDrawingRectangle.bind(this));
        this.fabricCanvas.on('mouse:up', ()=> {
          this.drawRectangle.stopDrawingRectangle.bind(this)();
          const selectTool = () => {
            this.selectedTool = tools[0];
            this.removeMouseEvents();
            this.addMouseEvents(this.selectedTool);
            this.fabricCanvas.forEachObject((obj) => {
              obj.lockMovementX = false;
              obj.lockMovementY = false;
            });
            this.canvas_state.activeTool.type = this.selectedTool.enum;
            localStorage.setItem('cocanvas_state', JSON.stringify(this.canvas_state));
          };
          selectTool();
        })
        break;
      case 'ELLIPSE':
        this.fabricCanvas.discardActiveObject().renderAll();
        this.fabricCanvas.setCursor('crosshair');
        this.fabricCanvas.on('mouse:down', this.drawEllipse.startDrawingEllipse.bind(this));
        this.fabricCanvas.on('mouse:move', this.drawEllipse.keepDrawingEllipse.bind(this));
        this.fabricCanvas.on('mouse:up', ()=> {
          this.drawEllipse.stopDrawingEllipse.bind(this)();
          const selectTool = () => {
            this.selectedTool = tools[0];
            this.removeMouseEvents();
            this.addMouseEvents(this.selectedTool);
            this.fabricCanvas.forEachObject((obj) => {
              obj.lockMovementX = false;
              obj.lockMovementY = false;
            });
            this.canvas_state.activeTool.type = this.selectedTool.enum;
            localStorage.setItem('cocanvas_state', JSON.stringify(this.canvas_state));
          };
          selectTool();
        }) 
        break;
      case 'ARROW':
        this.fabricCanvas.discardActiveObject().renderAll();
        this.fabricCanvas.setCursor('crosshair');
        this.fabricCanvas.on('mouse:down', this.drawArrow.startDrawingArrow.bind(this));
        this.fabricCanvas.on('mouse:move', this.drawArrow.keepDrawingArrow.bind(this));
        this.fabricCanvas.on('mouse:up', ()=>{
          this.drawArrow.stopDrawingArrow.bind(this)();
          const selectTool = () => {
            this.selectedTool = tools[0];
            this.removeMouseEvents();
            this.addMouseEvents(this.selectedTool);
            this.fabricCanvas.forEachObject((obj) => {
              obj.lockMovementX = false;
              obj.lockMovementY = false;
            });
            this.canvas_state.activeTool.type = this.selectedTool.enum;
            localStorage.setItem('cocanvas_state', JSON.stringify(this.canvas_state));
          };
          selectTool();
          this.addCustomControlPoints();
        });
        break;
      case 'FREE_DRAW':
        this.fabricCanvas.discardActiveObject().renderAll();
        this.fabricCanvas.selection = true;
        this.fabricCanvas.defaultCursor = 'crosshair';
        this.fabricCanvas.hoverCursor = 'crosshair';
        this.fabricCanvas.isDrawingMode = true;
        this.fabricCanvas.freeDrawingBrush.width = this.canvas_state.currentStrokeWidth;
        this.fabricCanvas.freeDrawingBrush.color = this.canvas_state.currentStrokeColor;
        this.fabricCanvas.freeDrawingBrush.strokeLineCap = 'round';
        this.fabricCanvas.freeDrawingBrush.strokeLineJoin = 'round';
        this.fabricCanvas.freeDrawingBrush.shadow = new fabric.Shadow(this.canvas_state.shadow);
        this.fabricCanvas.on('mouse:down', (e: any)=> {
          this.fabricCanvas.setCursor('crosshair');
        })
        this.fabricCanvas.on('path:created', (e: any) => {
          const path = e.path;
          path.set({data: uuidv4()});
          this.fabricCanvas.requestRenderAll();
          localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
        });
        break;
    }
  }
  removeMouseEvents(): void {
    this.fabricCanvas.off('mouse:down');
    this.fabricCanvas.off('mouse:move');
    this.fabricCanvas.off('mouse:up');
  }
  addKeyEvents(): void {
    // select all
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        this.fabricCanvas.setActiveObject(new fabric.ActiveSelection(this.fabricCanvas.getObjects(), {
          canvas: this.fabricCanvas,
        }));
        this.fabricCanvas.requestRenderAll();
      }
    });
    // delete, copy, paste
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Delete') {
        this.fabricCanvas.remove(...this.fabricCanvas.getActiveObjects());
        this.fabricCanvas.discardActiveObject().renderAll();
        localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
      }
      else if (e.ctrlKey && e.key === 'c') {
        this.fabricCanvas.getActiveObject()?.clone((clonedObj: any) => {
          this.clipboard = clonedObj;
        });
      }
      else if(e.ctrlKey && e.key === 'v') {
        if(!this.clipboard) return;
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
    // panning
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        if(this.isTyping) return;
        else {
          this.fabricCanvas.setCursor('grab');
          this.isPanning = true; 
          this.removeMouseEvents();
          this.addMouseEvents(tools[1]) 
        }
      }
    });
    window.addEventListener('keyup', (e)=> {
      if(e.key === ' ') {
        if(this.isTyping) return;
        else {
          this.isPanning = false;
          if (this.fabricCanvas.getActiveObject()) {
            this.fabricCanvas.discardActiveObject().renderAll();
          }
          this.removeMouseEvents();
          this.addMouseEvents(this.selectedTool);
        }
      }
    })
    // switch tools with numbers
    window.addEventListener('keydown', (e)=> {
      if(this.mouseDown && this.mouseMoving) return;
      if (isNaN(parseInt(e.key))) return;
      if (parseInt(e.key) > tools.length) return;
      this.canvas_state.activeTool.lastActiveTool = this.selectedTool.enum;
      this.selectedTool = tools[parseInt(e.key) - 1];
      this.removeMouseEvents();
      this.addMouseEvents(this.selectedTool);
      this.selectedTool.is_active = true;
      const prevTool = tools.find((tool)=> tool.enum === this.canvas_state.activeTool.lastActiveTool);
      if(prevTool) {
        prevTool.is_active = false;
        console.log(prevTool.enum, prevTool.is_active, "prevTool")
        console.log(this.selectedTool.enum, this.selectedTool.is_active, "selectedTool")
      }
      this.toolSelected.emit({ selectedTool: this.selectedTool })
      this.canvas_state.activeTool.type = this.selectedTool.enum;
      localStorage.setItem('cocanvas_state', JSON.stringify(this.canvas_state));
    })
  }
  addCustomControlPoints(): void {
    if(this.fabricCanvas.getActiveObject()) {
      if(this.fabricCanvas.getActiveObject() instanceof fabric.Group || this.fabricCanvas.getActiveObject()?.type === 'path' || this.fabricCanvas.getActiveObject()?.type==='group') {
        const group = this.fabricCanvas.getActiveObject() as fabric.Group;
        // group.hasBorders = false;
        group.hasControls = false;
        group.selectable = false;
        // add custom control points
        const midPointX = group.getCenterPoint().x;
        const midPointY = group.getCenterPoint().y;
        const curvePoint = new fabric.Circle({
          left: midPointX,
          top: midPointY,
          radius: 10,
          fill: 'red',
          opacity: 0.5,
          originX: 'center',
          originY: 'center',
          hasControls: false,
          hasBorders: false,
          selectable: false,
          evented: false,
        });
        this.fabricCanvas.add(curvePoint);
        this.fabricCanvas.renderAll();
      }
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTool']) {
      if(this.fabricCanvas) {
        this.selectedTool = changes['selectedTool'].currentValue;
        this.removeMouseEvents();
        this.addMouseEvents(this.selectedTool);
        this.canvas_state.activeTool.lastActiveTool = changes['selectedTool'].previousValue.enum;
        this.canvas_state.activeTool.type = this.selectedTool.enum;
        localStorage.setItem('cocanvas_state', JSON.stringify(this.canvas_state));
        this.fabricCanvas.requestRenderAll();
      }
    }
    if(changes['shapeProperties']) {
      this.shapeProperties = changes['shapeProperties'].currentValue;
      if(this.fabricCanvas){
        this.fabricCanvas.getActiveObjects().forEach((obj) => {
          if (obj.type === 'group' && obj instanceof fabric.Group) {
            (obj as fabric.Group).forEachObject((innerObj) => {
              innerObj.set({
                fill: this.shapeProperties.backgroundColor,
                strokeWidth: this.shapeProperties.strokeWidth,
                stroke: this.shapeProperties.strokeColor,
                strokeDashArray: this.shapeProperties.strokeStyle === 'dashed' ? [10, 5] : [0, 0],
                opacity: this.shapeProperties.opacity,
                shadow: new fabric.Shadow({
                  blur: this.shapeProperties.blur,
                  offsetX: this.shapeProperties.offsetX,
                  offsetY: this.shapeProperties.offsetY,
                  color: this.shapeProperties.shadowColor
                })
              });
            });
          }
          else {
            obj.set({
              fill: this.shapeProperties.backgroundColor,
              strokeWidth: this.shapeProperties.strokeWidth,
              stroke: this.shapeProperties.strokeColor,
              strokeDashArray: this.shapeProperties.strokeStyle === 'dashed' ? [10, 5] : [0, 0],
              opacity: this.shapeProperties.opacity,
              shadow: new fabric.Shadow({
                blur: this.shapeProperties.blur,
                offsetX: this.shapeProperties.offsetX,
                offsetY: this.shapeProperties.offsetY,
                color: this.shapeProperties.shadowColor
              })
            });
          }
        });
        this.fabricCanvas.renderAll();
        localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
      }
    }
  }
  ngOnDestroy(): void {
    this.subscriptionArray.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
