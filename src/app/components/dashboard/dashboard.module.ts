import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { TemplatesComponent } from './templates/templates.component';
import { SharedWithMeComponent } from './shared-with-me/shared-with-me.component';
import { TrashComponent } from './trash/trash.component';
import { AllBoardsComponent } from './all-boards/all-boards.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    TemplatesComponent,
    SharedWithMeComponent,
    TrashComponent,
    AllBoardsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'home', component: HomeComponent, title: 'Home'},
      { path: 'shared-with-me', component: SharedWithMeComponent, title: 'Shared'},
      { path: 'trash', component: TrashComponent, title: 'Trash'},
      { path: 'templates', component: TemplatesComponent, title: 'Templates'},
      { path: 'all-boards', component: AllBoardsComponent, title: 'All boards'},
      { path: '', redirectTo: 'home', pathMatch: 'full'}
    ])
  ]
})
export class DashboardModule { }
