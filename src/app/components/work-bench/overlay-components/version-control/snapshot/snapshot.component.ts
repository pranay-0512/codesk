import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { v4 as uuvidv4 } from 'uuid';
import { Node, Tree, VersionControlService } from 'src/app/_services/version-control/version-control.service';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { MenuItem } from 'src/app/_models/work-bench/menu-item/menu-item.model';
@Component({
  selector: 'app-snapshot',
  templateUrl: './snapshot.component.html',
  styleUrls: ['./snapshot.component.scss']
})
export class SnapshotComponent implements OnInit {
  @ViewChild('graphContainer') graphContainer: ElementRef | undefined;
  @Input() currNodeId!: string;
  @Output() emitTreeData = new EventEmitter<string>();
  public camera: MenuItem = {
    enum: 'CAMERA',
    title: 'Camera',
    icon: 'https://svgshare.com/i/15S3.svg',
    icon_invert: 'https://svgshare.com/i/15SC.svg',
    link: 'camera',
    onClick: () => {
      this.takeSnapshot();
    }
  }
  public canvasData: any;
  public tree!: Tree;
  constructor(private snapshotService: VersionControlService) {
    this.tree = this.snapshotService.versionTree;
  }
  ngOnInit(): void {
    this.tree = localStorage.getItem('cocanvas_version') ? JSON.parse(localStorage.getItem('cocanvas_version') || '{}') : new Tree(uuvidv4(), null, new Date().toString(), 'root');

    localStorage.setItem('cocanvas_version', JSON.stringify(this.tree));
  }
  takeSnapshot(): void {
    this.canvasData = localStorage.getItem('cocanvas_shapes');
    if(this.canvasData) {
      const snapshotId = uuvidv4();
      const snapshotDate = new Date().toString();
      const snapshotLabel = `Node ${this.snapshotService.versionTree.countNodes(this.tree.root)}`;
      this.snapshotService.takeSnapshot(this.canvasData, snapshotId, snapshotDate, snapshotLabel);
      this.tree = this.snapshotService.versionTree;
      const ed = this.encryptTreeData(this.tree, environment.crypto_secretkey);
      this.emitTreeData.emit(ed);
    }
  }
  encryptTreeData(tree: Tree, key: string): string {
    const jsonString = JSON.stringify(tree);
    const encryptedData = CryptoJS.AES.encrypt(jsonString, key).toString();
    return encryptedData;
  }

  findCurrNode(node_id: string): Node {
    // return the current node from the tree with the given node_id using bfs from snapshotService
    return this.snapshotService.findNode(this.tree.root, node_id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes['currNodeId'].firstChange){
      const current_node: Node = this.findCurrNode(changes['currNodeId'].currentValue);
      this.tree.currentNode = current_node;
      const ed = this.encryptTreeData(this.tree, environment.crypto_secretkey);
      this.emitTreeData.emit(ed);
      changes['currNodeId'].previousValue = uuvidv4();
    }
  }
}

