import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import InfiniteCanvas from 'ef-infinite-canvas'
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    this.background()
    const body = document.querySelector('body');
    body?.setAttribute('style', 'overflow: hidden');
  }
  
  background(): void {
    const canvas = new InfiniteCanvas(document.getElementById('co_canvas') as HTMLCanvasElement)
    const ctx = canvas?.getContext('2d');
    console.log(canvas.units)
    if (ctx) {
      ctx.fillStyle = '#329F5B';
      ctx.fillRect(100, 100, 200, 200);
    }
    // const patternSize = 5;
    // ctx.fillStyle = '#F0F0F0';
    // for (let x = 0; x < window.innerWidth; x += patternSize) {
    //   for (let y = 0; y < window.innerHeight; y += patternSize) {
    //     if ((x / patternSize + y / patternSize) % 2 === 0) {
    //       ctx.fillRect(x, y, patternSize, patternSize);
    //     }
    //   }
    // }
  }


}
