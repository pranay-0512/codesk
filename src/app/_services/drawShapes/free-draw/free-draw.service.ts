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
      value: 1
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
  // startDrawingFreeShape(event: any): void {
  //   if(event.e.buttons === 1){
  //     let pointer = this.fabricCanvas.getPointer(event.e);
  //     let pathData = `M ${pointer.x} ${pointer.y} L ${pointer.x} ${pointer.y}`;
  //     this.mouseDown = true;
  //     const freeShape: CoCanvasShape = {
  //       id: uuidv4(),
  //       type_enum: 'FREE_DRAW',
  //       free_draw: {
  //         startingPoint: [pointer.x, pointer.y],
  //         lastCommittedPoint: [pointer.x, pointer.y],
  //         points: [[pointer.x, pointer.y]],
  //       },
  //       line_width: this.canvas_state.currentStrokeWidth,
  //       stroke_color: this.canvas_state.currentStrokeColor,
  //       touchOffsetX: 0,
  //       touchOffsetY: 0,
  //       isSelected: false,
  //       isDragging: false
  //     }
  //     this.uuid = freeShape.id;
  //     this.shapes.push(freeShape);
  //     const path = new fabric.Path(pathData, {
  //       fill: undefined,
  //       stroke: this.canvas_state.currentStrokeColor,
  //       strokeWidth: this.canvas_state.currentStrokeWidth,
  //       strokeLineCap: 'round',
  //       strokeLineJoin: 'round',
  //       evented: false,
  //       selectable: false,
  //     });
  //     this.fabricCanvas.add(path);
  //     this.drawingPath = path;
  //     this.fabricCanvas.requestRenderAll();
  //   }
  // }
  // keepDrawingFreeShape(event: any): void {
  //   if(this.mouseDown) {
  //     let pointer = this.fabricCanvas.getPointer(event.e);
  //     let newPathData: any = `M ${this.shapes[this.shapes.length - 1].free_draw?.startingPoint[0]} ${this.shapes[this.shapes.length - 1].free_draw?.startingPoint[1]} L ${pointer.x} ${pointer.y}`;
  //     // let pathData = this.drawingPath.path as any;
  //     // pathData?.push(['L', pointer.x, pointer.y]);
  //     this.drawingPath.set({path: newPathData});
  //     let freeShape = this.shapes.find(shape => shape.id === this.uuid);
  //     if(freeShape){
  //       freeShape.free_draw = {
  //         startingPoint: freeShape.free_draw?.startingPoint ?? [0, 0],
  //         lastCommittedPoint: [pointer.x, pointer.y],
  //         points: [...freeShape.free_draw?.points ?? [], [pointer.x, pointer.y]]
  //       }
  //     }
  //     this.fabricCanvas.renderAll();
  //   }
  // }
  // stopDrawingFreeShape(): void {
  //   this.mouseDown = false;
  //   localStorage.setItem('shapes', JSON.stringify(this.shapes));
  // }
}
