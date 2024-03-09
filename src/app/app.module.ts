import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { SideMenuComponent } from './components/shared/side-menu/side-menu.component';
import { SharedModule } from './components/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { WebsocketShapeService } from './_services/websocket/websocket-shape.service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgbModule,
    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [WebsocketShapeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
