import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { MenuItem, MenuList } from 'src/app/_models/work-bench/menu-item/menu-item.model';
import { LocalstorageService } from 'src/app/_services/localstorage/localstorage.service';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss']
})
export class DropdownMenuComponent implements OnInit {
  public isShowMenu: boolean = false;
  public WorkBenchMenuItems: Array<MenuItem> = MenuList;
  constructor(private localStorageService: LocalstorageService) { }

  ngOnInit(): void {
    // when clicked outside of the dropdown menu, close the dropdown menu
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
      this.localStorageService.removeItem('cocanvas_shapes');
      this.localStorageService.removeItem('cocanvas_state');
      this.localStorageService.removeItem('cocanvas_version');
      this.localStorageService.removeItem('workbenchId')
    }
    else {
      item.onClick!();
    }
  }
}
