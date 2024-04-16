import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuItem, MenuList } from 'src/app/_models/work-bench/menu-item/menu-item.model';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss']
})
export class DropdownMenuComponent implements OnInit {
  public isShowMenu: boolean = false;
  public WorkBenchMenuItems: Array<MenuItem> = MenuList;
  constructor(private modal: NgbModal) { }

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
    item.onClick!();
  }
}
