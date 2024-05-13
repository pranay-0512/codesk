import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PalleteService {
  public isCollapsed: boolean = false;
  constructor() { }
  
  // toggle pallete collapse
  togglePalleteOpen() {
    this.isCollapsed = false;
    const mapContainer = document.getElementById('palette-container');
    const arrow = document.getElementById('arrow-left');
    if (mapContainer && arrow) {
      mapContainer.style.width = '12%';
      arrow.style.left = '12%';
      const canvas = document.getElementById('co_canvas');
      if(canvas) {
        // blur the canvas
        canvas.style.filter = 'blur(0px)';
      }
    }
  }

  togglePalleteClose() {
    this.isCollapsed = true;
    const mapContainer = document.getElementById('palette-container');
    const arrow = document.getElementById('arrow-left');
    if (mapContainer && arrow) {
      mapContainer.style.width = '0px';
      arrow.style.left = '0%';
      const canvas = document.getElementById('co_canvas');
      if(canvas) {
        canvas.style.filter = 'none';
      }
    }
  }
}
