import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { CoCanvasState } from 'src/app/_models/work-bench/canvas/canvas-state.model';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class EllipseService {
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
      width: screen.width,
      height: screen.height,
      selection: false,
    });
    this.drawEllipseShape();
  }
  drawEllipseShape() {
    this.fabricCanvas.on('mouse:down', this.startDrawingEllipse.bind(this));
    this.fabricCanvas.on('mouse:move', this.keepDrawingEllipse.bind(this));
    this.fabricCanvas.on('mouse:up', this.stopDrawingEllipse.bind(this));
  }
  startDrawingEllipse(event: any) {
    if(event.e.buttons === 1){
      this.fabricCanvas.forEachObject((obj) => {
        obj.lockMovementX = true;
        obj.lockMovementY = true;
      });
      this.fabricCanvas.renderAll();
      this.fabricCanvas.selection = false;
      this.fabricCanvas.defaultCursor = 'crosshair';
      let pointer = this.fabricCanvas.getPointer(event.e);
      this.mouseDown = true;
      this.uuid = uuidv4();
      if(this.fabricCanvas.getObjects()){
        this.fabricCanvas.discardActiveObject().renderAll();
      }
      let ellipse = new fabric.Ellipse({
        left: pointer.x,
        top: pointer.y,
        rx: 100,
        ry: 100,
        fill: this.canvas_state.currentFillStyle,
        stroke: this.canvas_state.currentStrokeColor,
        strokeWidth: this.canvas_state.currentStrokeWidth,
        selectable: true,
        opacity: 0.5,
        data: this.uuid,
        shadow: new fabric.Shadow(this.canvas_state.shadow),
        lockMovementX: true,
        lockMovementY: true,
      });
      ellipse.type = 'ellipse';
      this.fabricCanvas.add(ellipse);
      this.fabricCanvas.requestRenderAll();
    }
  }
  keepDrawingEllipse(event: any) {
    this.fabricCanvas.setCursor('crosshair');
    if(this.mouseDown) {
      let pointer = this.fabricCanvas.getPointer(event.e);
      if(this.fabricCanvas.getObjects()){
        this.fabricCanvas.discardActiveObject().renderAll();
      }
      let ellipse = this.fabricCanvas.getObjects()[this.fabricCanvas.getObjects().length - 1] as fabric.Ellipse;
      if(ellipse){
        ellipse.set({
          ry: Math.abs(pointer.y - (ellipse.top ?? 0)) / 2,
          rx: Math.abs(pointer.x - (ellipse.left ?? 0)) / 2,
          opacity: this.canvas_state.currentOpacity,
        });
      }
      this.fabricCanvas.renderAll();
    }
  }
  stopDrawingEllipse(): void {
    this.fabricCanvas.selection = true;
    const ellipse = this.fabricCanvas.getObjects()[this.fabricCanvas.getObjects().length - 1] as fabric.Ellipse;
    ellipse.set({
      opacity: this.canvas_state.currentOpacity,
    })
    this.fabricCanvas.setActiveObject(ellipse);
    localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
    this.mouseDown = false;
    this.fabricCanvas.renderAll();
  }
}
