import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { CoCanvasShape } from 'src/app/_models/work-bench/canvas/canvas-shape.model';
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
      value: 1
    }
  };
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
      this.fabricCanvas.selection = false;
      this.fabricCanvas.defaultCursor = 'crosshair';
      this.fabricCanvas.hoverCursor = 'crosshair';
      let pointer = this.fabricCanvas.getPointer(event.e);
      this.mouseDown = true;
      let ellipse = new fabric.Ellipse({
        rx: 0,
        ry: 0,
        left: pointer.x,
        top: pointer.y,
        fill: this.canvas_state.currentFillStyle,
        stroke: this.canvas_state.currentStrokeColor,
        strokeWidth: this.canvas_state.currentStrokeWidth,
        opacity: this.canvas_state.currentOpacity,
        selectable: true,
        shadow: new fabric.Shadow(this.canvas_state.shadow)
      });
      ellipse.type = 'ellipse';
      this.fabricCanvas.add(ellipse);
      this.fabricCanvas.requestRenderAll();
    }
  }
  keepDrawingEllipse(event: any) {
    if(this.mouseDown) {
      this.fabricCanvas.selection = false;
      this.fabricCanvas.defaultCursor = 'crosshair';
      this.fabricCanvas.hoverCursor = 'crosshair';
      let pointer = this.fabricCanvas.getPointer(event.e);
      let ellipse = this.fabricCanvas.getObjects()[this.fabricCanvas.getObjects().length - 1] as fabric.Ellipse;
      ellipse?.set({rx: Math.abs(pointer.x - (ellipse.left ?? 0)) / 2});
      ellipse?.set({ry: Math.abs(pointer.y - (ellipse.top ?? 0)) / 2});
      this.fabricCanvas.renderAll();
    }
  }
  stopDrawingEllipse() {
    this.mouseDown = false;
    this.fabricCanvas.selection = false;
    this.fabricCanvas.defaultCursor = 'crosshair';
    this.fabricCanvas.hoverCursor = 'crosshair';
    localStorage.setItem('cocanvas_shapes', JSON.stringify(this.fabricCanvas));
  }
}
