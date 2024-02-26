import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import InfiniteCanvas from 'ef-infinite-canvas'
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  @Input() selectedTool!: string;

  public isDrawing = false;
  constructor() { }

  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    const canvas = new InfiniteCanvas(document.getElementById('co_canvas') as HTMLCanvasElement)
    const ctx = canvas.getContext('2d');
    const body = document.querySelector('body');
    body?.setAttribute('style', 'overflow: hidden');
    if (ctx) {
      ctx.fillStyle = '#329F5B';
      ctx.fillRect(200, 200, 300, 300);
    }
  }

  drawFreeDraw(): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(200, 200);
      ctx.stroke();
    }
  }

  drawShape(x: number,y: number) {
    switch (this.selectedTool) {
      case 'pen':
        // drawing logic for pen tool
        break;
      case 'eraser':
        // drawing logic for eraser tool
        break;
      
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.isDrawing = true;
    this.drawShape(event.offsetX, event.offsetY);
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDrawing) {
      this.drawShape(event.offsetX, event.offsetY);
    }
  }

  onMouseUp(event: MouseEvent) {
    this.isDrawing = false;
  }

}
