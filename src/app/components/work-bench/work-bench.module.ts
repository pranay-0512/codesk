import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkBenchComponent } from './work-bench.component';
import { CanvasComponent } from './canvas/canvas.component';
import { CreateWorkBenchComponent } from './create-work-bench/create-work-bench.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    WorkBenchComponent,
    CanvasComponent,
    CreateWorkBenchComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: ':id', component: WorkBenchComponent },
      { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: '**', redirectTo: '/', pathMatch: 'full'}
    ])
  ]
})
export class WorkBenchModule { }
