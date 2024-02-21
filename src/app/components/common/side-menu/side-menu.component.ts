import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MenuList } from 'src/app/_models/menu-item/menu-item.model';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  public menuList: Array<MenuItem> = MenuList;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  goToLink(menuItem: MenuItem) {
    if(menuItem.link) {
      this.router.navigate([menuItem.link]);
    }
    else {
      window.open(menuItem.target as string, '_blank');
    }
  }

}
