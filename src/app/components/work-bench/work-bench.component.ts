import { Component, OnInit } from '@angular/core';
import { MenuItem, MenuList } from 'src/app/_models/work-bench/menu-item/menu-item.model';

@Component({
  selector: 'app-work-bench',
  templateUrl: './work-bench.component.html',
  styleUrls: ['./work-bench.component.scss']
})
export class WorkBenchComponent implements OnInit {
  constructor() { }
  public selectedTool!: string;

  onToolSelected(tool: string)  {
    this.selectedTool = tool;
  }
  ngOnInit(): void {
    console.log("work bench component loaded");
  }
  shareBoard(): void {
    console.log('share button clicked');
  }
  clearCanvas(): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}
