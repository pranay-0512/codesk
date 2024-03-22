import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { CoCanvasShape } from 'src/app/_models/work-bench/canvas/canvas-shape.model';
import { CoCanvasState } from 'src/app/_models/work-bench/canvas/canvas-state.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FreeDrawService {
  private fabricCanvas!: fabric.Canvas;
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
      type: 'FREE_DRAW',
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
  private uuid!: string;
  private drawingPath!: fabric.Path;
  constructor() {
    // this.fabricCanvas.isDrawingMode = true;
    // this.drawFreeShape();
  }
  drawFreeShape(): void {
    this.fabricCanvas.freeDrawingBrush.width = this.canvas_state.currentStrokeWidth;
    this.fabricCanvas.freeDrawingBrush.color = this.canvas_state.currentStrokeColor;
    let freeShape = new fabric.Path('M 0 0 L 0 0', {
      fill: undefined,
      stroke: this.canvas_state.currentStrokeColor,
      strokeWidth: this.canvas_state.currentStrokeWidth,
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
      evented: false,
      selectable: false,
      shadow: new fabric.Shadow(this.canvas_state.shadow)
    });
  }
}
