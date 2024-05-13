import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button.component';
import { LoaderComponent } from './loader/loader/loader.component';

const exportedComponents = [
  SideMenuComponent,
  ButtonComponent,
  LoaderComponent
];

@NgModule({
  declarations: [
    ...exportedComponents,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [...exportedComponents]
})
export class SharedModule { }
