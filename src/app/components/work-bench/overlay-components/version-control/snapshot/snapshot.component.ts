import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { v4 as uuvidv4 } from 'uuid';
import { Edge, Graph, Node, VersionControlService } from 'src/app/_services/version-control/version-control.service';
@Component({
  selector: 'app-snapshot',
  templateUrl: './snapshot.component.html',
  styleUrls: ['./snapshot.component.scss']
})
export class SnapshotComponent implements OnInit {
  @ViewChild('graphContainer') graphContainer: ElementRef | undefined;
  @Output() graphNodesEmitter = new EventEmitter<Node[]>();
  @Output() graphEdgesEmitter = new EventEmitter<Edge[]>();
  public canvasData: any;
  public graph: Graph = new Graph([], []);
  constructor(private snapshotService: VersionControlService) {
  }
  ngOnInit(): void {
  }
  takeSnapshot(): void {
    this.canvasData = localStorage.getItem('cocanvas_shapes');
    if(this.canvasData) {
      const snapshotId = uuvidv4();
      this.snapshotService.takeSnapshot(this.canvasData, snapshotId, new Date().toISOString(), `Node ${this.snapshotService.graph.nodes.length + 1}`);

      const numSnapshots = this.snapshotService.graph.nodes.length;
      if(numSnapshots > 1) {
        this.snapshotService.graph.addEdge(this.snapshotService.graph.nodes[numSnapshots - 2], this.snapshotService.graph.nodes[numSnapshots - 1]);
      }
      this.graph = this.snapshotService.graph;
      // this.graph.nodes.forEach(node => this.graphNodeEmitter.emit(node));
      // this.graph.edges.forEach(edge => this.graphEdgeEmitter.emit(edge));
      this.graphNodesEmitter.emit(this.graph.nodes)
      this.graphEdgesEmitter.emit(this.graph.edges)
      console.log(this.graph.edges)
    }
  }
}

