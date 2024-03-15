import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { Point } from 'fabric/fabric-impl';
import { CoCanvasShape } from 'src/app/_models/work-bench/canvas/canvas-shape.model';
import { CoCanvasState } from 'src/app/_models/work-bench/canvas/canvas-state.model';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class ArrowService {
  private fabricCanvas: fabric.Canvas;
  private shapes: CoCanvasShape[] = [];
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
      type: 'ARROW',
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
      this.fabricCanvas.selection = false;
      this.fabricCanvas.defaultCursor = 'crosshair';
      this.fabricCanvas.hoverCursor = 'crosshair';
      let pointer = this.fabricCanvas.getPointer(event.e);
      this.mouseDown = true;
      let arrow = new fabric.Path('M 0 0 L 0 0 L 0 0 L 0 0 z', {
        left: pointer.x,
        top: pointer.y,
        stroke: this.canvas_state.currentStrokeColor,
        strokeWidth: this.canvas_state.currentStrokeWidth,
        fill: this.canvas_state.currentFillStyle,
        shadow: new fabric.Shadow(this.canvas_state.shadow)
      });
      this.fabricCanvas.add(arrow);
      this.fabricCanvas.requestRenderAll();
    }
  }
  keepDrawingArrow(event: any) {
    if(this.mouseDown) {
      this.fabricCanvas.selection = false;
      this.fabricCanvas.defaultCursor = 'crosshair';
      this.fabricCanvas.hoverCursor = 'crosshair';
      let pointer = this.fabricCanvas.getPointer(event.e);
      let arrow = this.fabricCanvas.getObjects()[this.fabricCanvas.getObjects().length - 1] as fabric.Path;
      if(arrow) {
        arrow.set({
          left: pointer.x,
          top: pointer.y
        });
        let path: any = `M 0 0 L ${pointer.x} ${pointer.y} L ${pointer.x} ${pointer.y} L ${pointer.x} ${pointer.y} z`;
        arrow.set({path: path});
      }
      this.fabricCanvas.renderAll();
    }
  }
  stopDrawingArrow(event: any) {
    this.mouseDown = false;
    localStorage.setItem('shapes', JSON.stringify(this.fabricCanvas));
  }
}
