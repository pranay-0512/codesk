import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { CoCanvasState } from 'src/app/_models/work-bench/canvas/canvas-state.model';
import { CoCanvasTool, tools } from 'src/app/_models/work-bench/canvas/canvas-tool.model';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class RectangleService {
  private fabricCanvas: fabric.Canvas;
  private mouseDown: boolean = false;
  public canvas_state: CoCanvasState = {
    showWelcomeScreen: false,
    theme: 'light',
    currentFillStyle: 'rgba(255,0,0,0)',
    currentFontFamily: 0,
    currentFontSize: 16,
    currentOpacity: 1,
    currentRoughness: 1,
    currentStrokeColor: 'lime',
    currentRoundness: 10,
    currentStrokeStyle: 'solid',
    currentStrokeWidth: 5,
    currentTextAlign: 'left',
    editingGroupId: null,
    activeTool: {
      type: 'RECTANGLE',
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
    shadow: {
      blur: 0,
      offsetX: 5,
      offsetY: 3,
      color: 'black'
    },
    font_family: 'Arial',
    viewBackgroundColor: 'rgba(255,255,255,1)',
    zoom: {
      value: 1
    }
  };
  public uuid!: string;
  constructor() { 
    this.fabricCanvas = new fabric.Canvas('co_canvas', {
      width: screen.width,
      height: screen.height,
      selection: false,
    }); 
    this.drawRectangleShape();
  }
  drawRectangleShape() {
    this.fabricCanvas.on('mouse:down', this.startDrawingRectangle.bind(this));
    this.fabricCanvas.on('mouse:move', this.keepDrawingRectangle.bind(this));
    this.fabricCanvas.on('mouse:up', this.stopDrawingRectangle.bind(this));
  }
  startDrawingRectangle(event: any) {
    if(event.e.buttons === 1){
      this.fabricCanvas.selection = false;
      this.fabricCanvas.defaultCursor = 'crosshair';
      this.fabricCanvas.hoverCursor = 'crosshair';
      let pointer = this.fabricCanvas.getPointer(event.e);
      this.mouseDown = true;
      this.uuid = uuidv4();
      if(this.fabricCanvas.getObjects()){
        this.fabricCanvas.discardActiveObject().renderAll();
      }
      let rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: this.canvas_state.currentFillStyle,
        stroke: this.canvas_state.currentStrokeColor,
        strokeWidth: this.canvas_state.currentStrokeWidth,
        selectable: true,
        opacity: this.canvas_state.currentOpacity,
        data: this.uuid,
        shadow: new fabric.Shadow(this.canvas_state.shadow),
        rx: this.canvas_state.currentRoundness,
        ry: this.canvas_state.currentRoundness
      });
      rect.type = 'rect';
      this.fabricCanvas.add(rect);
      this.fabricCanvas.requestRenderAll();
    }
  }
  keepDrawingRectangle(event: any) {
    this.fabricCanvas.setCursor('crosshair');
    if(this.mouseDown) {
      let pointer = this.fabricCanvas.getPointer(event.e);
      if(this.fabricCanvas.getObjects()){
        this.fabricCanvas.discardActiveObject().renderAll();
      }
      let rectangle = this.fabricCanvas.getObjects()[this.fabricCanvas.getObjects().length - 1] as fabric.Rect;
      if(rectangle) {
        rectangle.set({
          width: Math.abs(pointer.x - (rectangle.left ?? 0)),
          height: Math.abs(pointer.y - (rectangle.top ?? 0))
        });
      }
      this.fabricCanvas.renderAll();
    }
  }
  stopDrawingRectangle(): void {
    this.fabricCanvas.selection = true;
    this.fabricCanvas.setActiveObject(this.fabricCanvas.getObjects()[this.fabricCanvas.getObjects().length - 1]);
    console.log(this.fabricCanvas.getObjects()[this.fabricCanvas.getObjects().length - 1]);
    this.fabricCanvas.renderAll();
    console.log("object")
    localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
    this.mouseDown = false;
  }
}
