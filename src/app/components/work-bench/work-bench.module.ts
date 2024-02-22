import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkBenchComponent } from './work-bench.component';
import { CanvasComponent } from './canvas/canvas.component';
import { CreateWorkBenchComponent } from './create-work-bench/create-work-bench.component';



@NgModule({
  declarations: [
    WorkBenchComponent,
    CanvasComponent,
    CreateWorkBenchComponent
  ],
  imports: [
    CommonModule
  ]
})
export class WorkBenchModule { }
