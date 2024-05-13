import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { CoCanvasState } from 'src/app/_models/work-bench/canvas/canvas-state.model';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class LineService {
  private fabricCanvas: fabric.Canvas;
  private mouseDown: boolean = false;
  private mouseMoving: boolean = false;
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
    font_family: 'Arial',
    viewBackgroundColor: 'rgba(255,255,255,1)',
    zoom: {
      value: 1,
      offsetX: 0,
      offsetY: 0
    }
  };
  public uuid!: string;
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
      this.uuid = uuidv4();
      let linePath = `M ${pointer.x} ${pointer.y} L ${pointer.x} ${pointer.y}`;
      let line = new fabric.Path(linePath, {
        stroke: this.canvas_state.currentStrokeColor,
        fill: this.canvas_state.currentFillStyle,
        strokeWidth: this.canvas_state.currentStrokeWidth,
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
        data: this.uuid,
        selectable: true,
        objectCaching: false,
        lockMovementX: true,
        lockMovementY: true,
        opacity: this.canvas_state.currentOpacity
      });
      this.fabricCanvas.add(line);
      this.fabricCanvas.requestRenderAll();
    }
  }
  keepDrawingLine(event: any): void {
    this.fabricCanvas.setCursor('crosshair');
    this.mouseMoving = true;
    if(this.mouseDown && this.mouseMoving) {
      this.fabricCanvas.selection = false;
      this.fabricCanvas.defaultCursor = 'crosshair';
      this.fabricCanvas.hoverCursor = 'crosshair';
      if(this.fabricCanvas.getObjects()){
        this.fabricCanvas.discardActiveObject().renderAll();
      }
      let pointer = this.fabricCanvas.getPointer(event.e);
      let line: any = this.fabricCanvas.getObjects().find((obj) => obj.data === this.uuid) as fabric.Path;
      line.path[1][1] = pointer.x;
      line.path[1][2] = pointer.y;
      line.setCoords();
      this.fabricCanvas.requestRenderAll();
    }
  }
  stopDrawingLine(): void {
    this.fabricCanvas.selection = true;
    let line = this.fabricCanvas.getObjects().find((obj) => obj.data === this.uuid) as fabric.Path;
    const renderLine = new fabric.Path(line.path, {
      stroke: this.canvas_state.currentStrokeColor,
      fill: this.canvas_state.currentFillStyle,
      strokeWidth: this.canvas_state.currentStrokeWidth,
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
      data: this.uuid,
      selectable: true,
      objectCaching: false,
      lockMovementX: false,
      lockMovementY: false,
      opacity: this.canvas_state.currentOpacity
    });
    renderLine.selectable = true;
    this.fabricCanvas.remove(line);
    this.fabricCanvas.add(renderLine);
    this.fabricCanvas.setActiveObject(renderLine);
    this.setLocalStorage(this.fabricCanvas);
    this.mouseDown = false;
    this.mouseMoving = false;
    this.fabricCanvas.requestRenderAll();
  }
  setLocalStorage(data: fabric.Canvas): void {
    const serializedData = JSON.stringify(data);
    localStorage.setItem('cocanvas_shapes', serializedData);
  }
}
