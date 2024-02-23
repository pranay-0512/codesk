import { Component, OnInit } from '@angular/core';
import { MenuItem, MenuList } from 'src/app/_models/work-bench/menu-item/menu-item.model';

@Component({
  selector: 'app-work-bench',
  templateUrl: './work-bench.component.html',
  styleUrls: ['./work-bench.component.scss']
})
export class WorkBenchComponent implements OnInit {
  public menuItems: Array<MenuItem> = MenuList;
  constructor() { }

  ngOnInit(): void {
  }
  shareBoard(): void {
    console.log('share button clicked');
  }
}
