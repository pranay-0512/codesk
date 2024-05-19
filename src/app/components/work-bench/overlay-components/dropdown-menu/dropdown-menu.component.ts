import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import { MenuItem, MenuList } from 'src/app/_models/work-bench/menu-item/menu-item.model';
import { CreateWorkBenchResp, CreateWorkbenchReq } from 'src/app/_models/work-bench/workbench.model';
import { LoaderService } from 'src/app/_services/loader/loader.service';
import { LocalstorageService } from 'src/app/_services/localstorage/localstorage.service';
import { WorkBenchService } from 'src/app/_services/workbench/workbench.service';
import { ModalComponent } from 'src/app/components/shared/modal/modal/modal.component';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss']
})
export class DropdownMenuComponent implements OnInit {
  public isShowMenu: boolean = false;
  public WorkBenchMenuItems: Array<MenuItem> = MenuList;
  constructor(public router: Router ,private modal: NgbModal ,private loader: LoaderService  ,private localStorageService: LocalstorageService, private workbenchService: WorkBenchService) { }

  ngOnInit(): void {
    document.addEventListener('click', (event) => {
      if (this.isShowMenu && !(event.target as Element)?.closest('.menu-container')) {
        event.stopPropagation();
        this.isShowMenu = false;
        this.showMenu();
      }
    });
  }
  showMenu(): void {
    this.isShowMenu = !this.isShowMenu;
  }
  menuContextAction(item: MenuItem): void {
    this.isShowMenu = false;
    if(item.enum === 'RESET_CANVAS') {
      this.loader.showLoader();
      const workbenchId = this.localStorageService.getItem('workbenchId');
      const modalRef = this.modal.open(ModalComponent, { centered: true, backdrop: 'static', windowClass: 'modal-container' });
      modalRef.componentInstance.inputData = { title: 'Reset Canvas?', type: 'reset', description: 'Resetting the canvas will remove all the shapes and data from the canvas.' };
      modalRef.result.then((result) => {
        if (result === 'proceed') {
          this.workbenchService.deleteWorkBenchData(workbenchId).subscribe({
            next: () => {
              
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              setTimeout(() => {
                this.localStorageService.removeItem('cocanvas_shapes');
                this.localStorageService.removeItem('cocanvas_state');
                this.localStorageService.removeItem('cocanvas_version');
                this.loader.hideLoader();
              }, 500)
            }
          })
        }
        else {
          this.loader.hideLoader();
          return;
        }
      });
    }
    else if (item.enum === 'CREATE_NEW_CANVAS') {
      const modal = this.modal.open(ModalComponent, { centered: true, backdrop: 'static', windowClass: 'modal-container'});
      modal.componentInstance.inputData = { 
        title: 'Create New Canvas?', 
        type: 'create', 
        description: 'Create a new canvas and download its ID to access or share it later.' 
      };
      
      modal.result.then((result) => {
        if (result === 'proceed') {
          this.localStorageService.removeItem('cocanvas_shapes');
          this.localStorageService.removeItem('cocanvas_state');
          this.localStorageService.removeItem('cocanvas_version');
          this.localStorageService.removeItem('workbenchId');
          this.loader.showLoader();
          let workbenchId = ''
          const req: CreateWorkbenchReq = {
            name: `Workbench ${Math.floor(Math.random() * 100)}`,
            description: `Description ${Math.floor(Math.random() * 100)}`,
            data: null
          }
          this.workbenchService.createWorkBench(req).subscribe({
            next: (response: CreateWorkBenchResp) => {
              workbenchId = response._id;
              console.log(response._id);
              this.localStorageService.setItem('workbenchId', workbenchId);
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              setTimeout(() => {
                this.router.navigate(['/work-bench', workbenchId]);
                this.loader.hideLoader();
              }, 500)
            }
          })
        }
        else {
          return;
        }
      });
    }
    else {
      item.onClick!();
    }
  }
}
