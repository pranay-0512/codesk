import { Injectable } from '@angular/core';
// import uuid from 'uuid';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})

export class VersionControlService {
  // This service will be used to implement version control in the workbench.
  // It will implement Directed Acyclic Graph to store the snapshots. 
  // A snapshot is a state of the canvas at a particular time (date) with unique ID. It is stored in a vertex in the DAG.
  // Always keep track of the current vertex where user is working.
  // Basically everytime a snapshot is taken, a new vertex will be created, and an edge will be directed from the current vertex
      // to the new vertex. Use adjacency list to store the graph.
  // before taking a snapshot, check for changes in canvas state. If there are no changes, the snapshot will not be taken
      // or new branch won't be created.
  public graph!: Graph;
  public current!: Node;
  constructor() {
    this.graph = new Graph([], []);
  }

  takeSnapshot(canvasData: any, id: string, date: string, label: string): void {
    const vertex = new Node(id, canvasData, date, label);
    this.graph.addVertex(vertex.id, vertex.data, vertex.date, vertex.label);
    this.current = vertex;
  }

  addRelationship(sourceId: string, targetId: string): void {
    const source = this.graph.nodes.find(node => node.id === sourceId);
    const target = this.graph.nodes.find(node => node.id === targetId);
    if(source && target) {
      this.graph.addEdge(source, target);
    } else {
      console.error('Source or target not found');
    }
  }

  jumpToNode(id: string): void {
    const node = this.graph.nodes.find(node => node.id === id);
    if(node) {
      this.current = node;
    } else {
      console.error('Node not found');
    }
  }

  displayGraph(): void {
    console.log(this.graph);
  }

}
export class Node {
  id!: string;
  data!: any;
  date!: string;
  label!: string;

  constructor(id: string, data: any, date: string, label: string) {
    this.id = id;
    this.data = data;
    this.date = date;
    this.label = label;
  }
}
export class Edge {
  source: Node;
  target: Node;

  constructor(source: Node, target: Node) {
    this.source = source;
    this.target = target;
  }
}

export class Graph {
  nodes: Node[];
  edges: Edge[];

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  addVertex(id: string, data: any, date: string, label: string): Node {
    const vertex = new Node(id, data, date, label);
    this.nodes.push(vertex);
    return vertex;
  }

  addEdge(source: Node, target: Node): Edge {
    const edge = new Edge(source, target);
    this.edges.push(edge);
    return edge;
  }
}
