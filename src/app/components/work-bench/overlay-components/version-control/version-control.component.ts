import { Component, OnInit } from '@angular/core';
import { tree } from 'd3';
import { Node, Tree } from 'src/app/_services/version-control/version-control.service';

@Component({
  selector: 'app-version-control',
  templateUrl: './version-control.component.html',
  styleUrls: ['./version-control.component.scss']
})
export class VersionControlComponent implements OnInit {
  public encryptedTreeData!: string;
  public currNodeId!: string;
  constructor() { }

  ngOnInit(): void {
  }
  receiveTreeData(data: string): void {
    this.encryptedTreeData = data;
  }
  receiveCurrNodeId(data: string): void {
    this.currNodeId = data;
  }
}
