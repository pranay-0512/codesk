import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { CoCanvasState } from 'src/app/_models/work-bench/canvas/canvas-state.model';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class ArrowService {
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
      type: 'ELLIPSE',
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
  public uuid!: string;
  constructor() { 
    this.fabricCanvas = new fabric.Canvas('co_canvas', {
      width: window.innerWidth,
      height: window.innerHeight,
      selection: false,
    });
    this.drawArrowShape();
  }
  drawArrowShape() {
    this.fabricCanvas.on('mouse:down', this.startDrawingArrow.bind(this));
    this.fabricCanvas.on('mouse:move', this.keepDrawingArrow.bind(this));
    this.fabricCanvas.on('mouse:up', this.stopDrawingArrow.bind(this));
  }
  startDrawingArrow(event: any) {
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
        data: 'arrowLine',
        selectable: false,
        objectCaching: false,
        lockMovementX: true,
        lockMovementY: true,
        opacity: this.canvas_state.currentOpacity
      });
      let arrowHeadPath = `M 0 0 L 10 5 L 0 10`;
      let arrowHead1 = new fabric.Path(arrowHeadPath, {
        left: pointer.x,
        top: pointer.y,
        stroke: this.canvas_state.currentStrokeColor,
        fill: this.canvas_state.currentStrokeColor,
        strokeWidth: this.canvas_state.currentStrokeWidth - 3,
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
        selectable: false,
        data: 'arrowHead',
        evented: false,
        originX: 'center',
        originY: 'center',
        lockMovementX: true,
        lockMovementY: true,
        opacity: this.canvas_state.currentOpacity
      });
      this.fabricCanvas.add(arrowHead1, line);
      this.fabricCanvas.requestRenderAll();
    }
  }
  keepDrawingArrow(event: any) {
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
      let arrowHead1 = this.fabricCanvas.getObjects().find((obj) => obj.data === 'arrowHead') as fabric.Path;
      let line: any = this.fabricCanvas.getObjects().find((obj) => obj.data === 'arrowLine') as fabric.Path;
      line.path[1][1] = pointer.x;
      line.path[1][2] = pointer.y;
      line.setCoords();
      arrowHead1.left = pointer.x;
      arrowHead1.top = pointer.y;
      let width = pointer.x - line.path[0][1];
      let height = pointer.y - line.path[0][2];
      arrowHead1.angle = Math.atan2(height, width) * 180 / Math.PI;
      arrowHead1.setCoords();
      this.fabricCanvas.requestRenderAll();
    }
  }
  stopDrawingArrow() {
    this.fabricCanvas.selection = true;
    let line = this.fabricCanvas.getObjects().find((obj) => obj.data === 'arrowLine') as fabric.Path;
    let arrowHead1 = this.fabricCanvas.getObjects().find((obj) => obj.data === 'arrowHead') as fabric.Path;
    const renderLine = new fabric.Path(line.path, {
      stroke: this.canvas_state.currentStrokeColor,
      fill: this.canvas_state.currentStrokeColor,
      strokeWidth: this.canvas_state.currentStrokeWidth,
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
      selectable: true,
      objectCaching: false,
      lockMovementX: true,
      lockMovementY: true,
      opacity: this.canvas_state.currentOpacity
    });
    let group = new fabric.Group([renderLine, arrowHead1], {
      selectable: true,
      data: {uuid: this.uuid, type: 'arrowGroup'},
      objectCaching: false
    });
    group.selectable = false;
    this.fabricCanvas.remove(line,arrowHead1);
    this.fabricCanvas.add(group);
    this.fabricCanvas.setActiveObject(group);
    localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
    this.mouseDown = false;
    this.mouseMoving = false;
    this.fabricCanvas.requestRenderAll();
  }
}
