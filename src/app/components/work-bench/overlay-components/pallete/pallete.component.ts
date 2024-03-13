import { Component, Input, OnInit } from '@angular/core';
import { CoCanvasShape } from 'src/app/_models/work-bench/canvas/canvas-shape.model';

@Component({
  selector: 'app-pallete',
  templateUrl: './pallete.component.html',
  styleUrls: ['./pallete.component.scss']
})
export class PalleteComponent implements OnInit {
  @Input() selected_shape!: CoCanvasShape;
  constructor() { }

  ngOnInit(): void {
  }
  // emit the updated shape to the parent component
  // updateShape(shape: CoCanvasShape) {
  //   if(this.selected_shape.roundness) {
  //   this.selected_shape = shape;
  // }

}
