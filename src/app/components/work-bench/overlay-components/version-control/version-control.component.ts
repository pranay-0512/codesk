import { Component, OnInit } from '@angular/core';
import { Edge, Node } from 'src/app/_services/version-control/version-control.service';

@Component({
  selector: 'app-version-control',
  templateUrl: './version-control.component.html',
  styleUrls: ['./version-control.component.scss']
})
export class VersionControlComponent implements OnInit {
  public graphNodes: Node[] = []
  public graphEdges: Edge[] = []
  constructor() { }

  ngOnInit(): void {
  }
  receiveGraphEdgeData(data: Edge[]): void {
    this.graphEdges = [...data]
  }
  receiveGraphNodeData(data: Node[]): void {
    this.graphNodes = [...data]
  }
}
