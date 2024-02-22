import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { SharedWithMeComponent } from './shared-with-me/shared-with-me.component';
import { TrashComponent } from './trash/trash.component';
import { AllBoardsComponent } from './all-boards/all-boards.component';
import { TemplateBoardsComponent } from './template-boards/template-boards.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    SharedWithMeComponent,
    TrashComponent,
    AllBoardsComponent,
    TemplateBoardsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        children: [
          { path: 'home', component: HomeComponent },
          { path: 'shared-with-me', component: SharedWithMeComponent },
          { path: 'trash', component: TrashComponent },
          { path: 'all-boards', component: AllBoardsComponent },
          { path: 'templates', component: TemplateBoardsComponent },
          { path: '', redirectTo: 'home', pathMatch: 'full' },
        ]
      }
    ])
  ]
})
export class DashboardModule { }
