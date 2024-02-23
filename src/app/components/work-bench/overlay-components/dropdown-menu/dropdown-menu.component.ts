import { Component, Input, OnInit } from '@angular/core';
import { MenuItem, MenuList } from 'src/app/_models/work-bench/menu-item/menu-item.model';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss']
})
export class DropdownMenuComponent implements OnInit {
  public menuItems: Array<MenuItem> = MenuList;
  constructor() { }

  ngOnInit(): void {
  }

}
