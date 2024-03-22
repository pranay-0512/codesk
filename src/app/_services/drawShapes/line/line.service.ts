import { Injectable } from '@angular/core';
import { end } from '@popperjs/core';
import { fabric } from 'fabric';
import { CoCanvasShape } from 'src/app/_models/work-bench/canvas/canvas-shape.model';
import { CoCanvasState } from 'src/app/_models/work-bench/canvas/canvas-state.model';

@Injectable({
  providedIn: 'root'
})
export class LineService {
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
      type: 'LINE',
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
      value: 1,
      offsetX: 0,
      offsetY: 0
    }
  };
  constructor() {
    this.fabricCanvas = new fabric.Canvas('co_canvas', {
      width: window.innerWidth,
      height: window.innerHeight,
      selection: false,
    });
    this.drawLineShape();
  }
  drawLineShape(): void {
    this.fabricCanvas.on('mouse:down', this.startDrawingLine.bind(this));
    this.fabricCanvas.on('mouse:move', this.keepDrawingLine.bind(this));
    this.fabricCanvas.on('mouse:up', this.stopDrawingLine.bind(this));
  }
  startDrawingLine(event: any): void {
    if(event.e.buttons === 1){
      this.fabricCanvas.forEachObject((obj) => {
        obj.lockMovementX = true;
        obj.lockMovementY = true;
      });
      this.fabricCanvas.renderAll();
      this.fabricCanvas.selection = false;
      this.fabricCanvas.defaultCursor = 'crosshair';
      this.fabricCanvas.hoverCursor = 'crosshair';
      if(this.fabricCanvas.getObjects()){
        this.fabricCanvas.discardActiveObject().renderAll();
      }
      let pointer = this.fabricCanvas.getPointer(event.e);
      this.mouseDown = true;
      let line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        strokeWidth: this.canvas_state.currentStrokeWidth,
        stroke: this.canvas_state.currentStrokeColor,
        opacity: this.canvas_state.currentOpacity,
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
        selectable: true,
        lockMovementX: true,
        lockMovementY: true,
        shadow: new fabric.Shadow(this.canvas_state.shadow)
      });
      this.fabricCanvas.add(line);
      this.fabricCanvas.requestRenderAll();
    }
  }
  keepDrawingLine(event: any): void {
    this.fabricCanvas.setCursor('crosshair');
    if(this.mouseDown) {
      this.fabricCanvas.selection = false;
      this.fabricCanvas.defaultCursor = 'crosshair';
      this.fabricCanvas.hoverCursor = 'crosshair';
      if(this.fabricCanvas.getObjects()){
        this.fabricCanvas.discardActiveObject().renderAll();
      }
      let pointer = this.fabricCanvas.getPointer(event.e);
      let line = this.fabricCanvas.getObjects()[this.fabricCanvas.getObjects().length - 1] as fabric.Line;
      line.set({ x2: pointer.x, y2: pointer.y });
      this.fabricCanvas.requestRenderAll();
    }
  }
  stopDrawingLine(): void {
    this.fabricCanvas.selection = true;
    const line = this.fabricCanvas.getObjects()[this.fabricCanvas.getObjects().length - 1] as fabric.Line;
    this.fabricCanvas.setActiveObject(line);
    localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
    this.mouseDown = false;
    this.fabricCanvas.requestRenderAll();
  }
}
