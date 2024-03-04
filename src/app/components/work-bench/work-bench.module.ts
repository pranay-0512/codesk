import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkBenchComponent } from './work-bench.component';
import { CanvasComponent } from './canvas/canvas.component';
import { CreateWorkBenchComponent } from './create-work-bench/create-work-bench.component';
import { RouterModule } from '@angular/router';
import { DropdownMenuComponent } from './overlay-components/dropdown-menu/dropdown-menu.component';
import { ToolsComponent } from './overlay-components/tools/tools.component';
import { UtilityComponent } from './overlay-components/utility/utility.component';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    WorkBenchComponent,
    CanvasComponent,
    CreateWorkBenchComponent,
    DropdownMenuComponent,
    ToolsComponent,
    UtilityComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    RouterModule.forChild([
      { path: ':id', component: WorkBenchComponent },
      { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: '**', redirectTo: '/', pathMatch: 'full'}
    ])
  ]
})
export class WorkBenchModule { }
