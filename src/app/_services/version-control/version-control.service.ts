import { Injectable } from '@angular/core';
// import uuid from 'uuid';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})

export class VersionControlService {
  // This service will be used to implement version control in the workbench.
  // It will implement Tree to store the snapshots. 
  // A snapshot is a state of the canvas at a particular time (date) with unique ID. It is stored in a node in the tree.
  // Always keep track of the current vertex where user is working.
  // Everytime a snapshot is taken, and the current node does not have any children, continue from that node.
  // If the current node has children, create a new branch. The node will have multiple children.
  // before taking a snapshot, check for changes in canvas state. If there are no changes, the snapshot will not be taken
      // or new branch won't be created.


  public versionTree!: Tree;
  constructor() {
    this.versionTree = new Tree(uuidv4(), null, new Date().toString(), 'root');
  }
  takeSnapshot(canvasData: any, id: string, date: string, label: string): void {
    // take a snapshot of the current state of the canvas
    const node = new Node(id, canvasData, date, label);
    this.versionTree.addNode(node.id, node.data, node.date, node.label);
  }
  findNode(root: Node, node_id: string): Node {
    // return the node with the given node_id using bfs
    const queue: Node[] = []; // Queue to store nodes for BFS traversal
    const visited: Node[] = []; // Array to track visited nodes

    if (!root) {
      return root;
    }

    queue.push(root); // Enqueue the root node

    while (queue.length > 0) {
      const current = queue.shift()!; // Dequeue the current node
      visited.push(current); // Mark the current node as visited

      if (current.id === node_id) {
        return current;
      }

      // Enqueue all children of the current node
      for (const child of current.children) {
        queue.push(child);
      }
    }

    return root;
  }

}
// implement the tree data structure here.
export class Node {
  id!: string;
  data!: any;
  label!: string;
  date!: string;
  children: Node[] = [];
  
  constructor(id: string, data: any, date: string, label: string) {
    this.id = id;
    this.data = data;
    this.date = date;
    this.label = label;
    this.children = [];
  }

  addChild(child: Node): void {
    this.children.push(child);
  }

  count(): number {
    return this.children.length;
  }
}

export class Tree {
  root!: Node
  currentNode!: Node

  constructor(id: string, data: any, date: string, label: string) {
    this.root = new Node(id, data, date, label);
    this.currentNode = this.root;
  }

  addNode(id: string, data: any, date: string, label: string): void {
    const newNode = new Node(id, data, date, label);
    this.currentNode.addChild(newNode);
    this.currentNode = newNode;
  }

  countNodes(root: Node): number {
    if(!root) {
      return 0;
    }
    let count = 1;
    for(let child of root.children) {
      count += this.countNodes(child)
    }

    return count;
  }  
}
