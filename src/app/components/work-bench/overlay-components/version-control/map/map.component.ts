import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { fabric } from 'fabric';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { Subscription } from 'rxjs';
import { parse, v4 as uuvidv4 } from 'uuid';
import { MenuItem } from 'src/app/_models/work-bench/menu-item/menu-item.model';
import { WorkBenchService } from 'src/app/_services/workbench/workbench.service';
import { ActivatedRoute } from '@angular/router';
import { CreateWorkBenchResp, CreateWorkbenchReq, UpdateWorkBenchReq } from 'src/app/_models/work-bench/workbench.model';
import { LoaderService } from 'src/app/_services/loader/loader.service';
import { LocalstorageService } from 'src/app/_services/localstorage/localstorage.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('graphSvg', {static: true}) graphContainer: ElementRef | undefined;
  public isCollapsed: boolean = false;
  public tree!: Tree;
  public canvasData: any;
  public storageSubscription!: Subscription;
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
  public workbenchId!: string;
  constructor(private workbenchService: WorkBenchService, private route: ActivatedRoute, private loader: LoaderService, private localStorageService: LocalstorageService) {
  }
  ngOnInit(): void {
    this.workbenchId = localStorage.getItem('workbenchId') || '';
    this.fetchTree();
  }
  setLocalStorage(data: any, key: string): void {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  }
  getLocalStorage(key: string): Tree | null {
    const serializedData = localStorage.getItem(key);
    if (serializedData !== null) {
      const parsedData = JSON.parse(serializedData);
      const tree = new Tree(parsedData.root.id, parsedData.root.data, parsedData.root.date, parsedData.root.label);
      return tree;
    }
    return null;
  }
  encryptTreeData(tree: Tree, key: string): string {
    const jsonString = JSON.stringify(tree);
    const encryptedData = CryptoJS.AES.encrypt(jsonString, key).toString();
    return encryptedData;
  }
  decryptTreeData(encryptedData: string, key: string): Tree {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
    const parsedData = JSON.parse(decryptedData);
    const tree: Tree = new Tree(parsedData.root.id, parsedData.root.data, parsedData.root.date, parsedData.root.label);
    return tree;
  }
  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    if(this.isCollapsed) {
      const mapContainer = document.getElementById('map-container');
      const arrow = document.getElementById('arrow');
      if (mapContainer && arrow) {
        mapContainer.style.width = '30%';
        arrow.style.right = '30%';
        const canvas = document.getElementById('co_canvas');
        if(canvas) {
          // blur the canvas
          canvas.style.filter = 'blur(0px)';
        }
      }
    }
    else {
      const mapContainer = document.getElementById('map-container');
      const arrow = document.getElementById('arrow');
      if (mapContainer && arrow) {
        mapContainer.style.width = '0px';
        arrow.style.right = '0%';
        const canvas = document.getElementById('co_canvas');
        if(canvas) {
          canvas.style.filter = 'none';
        }
      }
    
    }
  }
  renderTree(root: Node): void {
    d3.select(this.graphContainer?.nativeElement).selectAll('svg').remove();

    const margin = { top: 20, right: 0, bottom: 50, left: 0 };
    const maxSvgHeight = 517;
    const maxSvgWidth = 576;

    const numNodes = this.countNodes(root);
    const dynamicHeight = Math.min(numNodes * 60, maxSvgHeight);
    const dynamicWidth = Math.min(numNodes * 90, maxSvgWidth);

    const treeLayout = d3.tree<Node>()
                        .size([dynamicWidth, dynamicHeight - margin.bottom]);

    const svg = d3.select(this.graphContainer?.nativeElement)
                  .append('svg')
                  .attr('class', 'svg-map')
                  .attr('width', dynamicWidth)
                  .attr('height', dynamicHeight)
                  .append('g')
                  .attr('transform', `translate(${margin.left},${margin.top})`);
    const rootNode = d3.hierarchy(root);
    const treeNodes = treeLayout(rootNode);
    const links = svg.selectAll('.link')
    .data(treeNodes.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        return `M${d.source.x},${d.source.y}C${d.source.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${(d.source.y + d.target.y) / 2} ${d.target.x},${d.target.y}`;
      })
      .style('fill', 'none')
      .style('stroke', '#1d1d1d')
      .style('stroke-width', 2)
      .style('stroke-linecap', 'round')
      .style('stroke-linejoin', 'round');

    const nodes = svg.selectAll('.node')
      .data(treeNodes.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

    nodes.append('circle')
        .attr('r', 10)
        .style('fill', '#1d1d1d')
        .style('stroke', '#1d1d1d')
        .style('stroke-width', 2)
        .style('cursor', 'pointer')
        .style('fill', (d: any) => d.data.id === this.tree.currentNode.id ? '#db7807' : '#1d1d1d')
        // on mouse hover, scale the circle
        .on('mouseover', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 14);
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 10);
        })
        .on('click', (event, d) => {
          d3.selectAll('circle')
            .style('fill', '#1d1d1d');;
          d3.select(event.target)
            .style('fill', '#db7807');
          this.tree.currentNode = d.data;
          this.renderCanvas(this.tree.currentNode);
        })
        .append('title')
        .text((d: any) => d.data.label);

    nodes.append('text')
        .attr('dy', 5)
        .attr('x', 20)
        .attr('text-anchor', 'start')
        .attr('font-size', '12px')
        .style('fill', '#1d1d1d')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .style('cursor', 'pointer')
        .text((d: any) => d.data.label);

  }
  countNodes(node: Node): number {
    if (node.children.length === 0) {
      return 1;
    }
    let count = 1;
    for (const child of node.children) {
      count += this.countNodes(child);
    }
    return count;
  }
  renderCanvas(data: Node): void {
    const cocanvas_shapes = data.data;
    if(cocanvas_shapes === null || cocanvas_shapes === undefined) {
      this.localStorageService.setItem('cocanvas_shapes', null);
    }
    else {
      this.localStorageService.setItem('cocanvas_shapes', cocanvas_shapes);
      console.log("local storage value changed") 
    }
  }
  fetchTree(): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    canvas.style.filter = 'blur(5px)';
    this.loader.showLoader();
    this.workbenchService.getWorkBench(this.workbenchId).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if(!resp.data) {
          console.log("creating new tree coz resp is null")
          this.tree = new Tree(uuvidv4(), null, new Date().toString(), 'Root');
          console.log(this.tree)
          this.renderTree(this.tree.root);
        } else {
          console.log("tree already exists")
          const tree = this.decryptTreeData(resp.data, environment.crypto_secretkey);
          this.tree = tree;
          console.log(this.tree)
          this.renderTree(this.tree.root);
        }
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        setTimeout(() => {
          const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
          canvas.style.filter = 'none';
          this.loader.hideLoader();
        }, 1000);
      }
    })
  }
  takeSnapshot(): void {
    this.canvasData = localStorage.getItem('cocanvas_shapes');
    this.loader.showLoader();
    if(!this.canvasData || this.canvasData === undefined) return;
    
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    canvas.style.filter = 'blur(20px)';
    const node = new Node(uuvidv4(), this.canvasData, new Date().toString(), `Node ${this.tree.countNodes(this.tree.root)}`);
    this.tree.addNode(node.id, node.data, node.date, node.label);
    const reqData: UpdateWorkBenchReq = {
      data: this.encryptTreeData(this.tree, environment.crypto_secretkey)
    }
    this.workbenchService.updateWorkBench(this.workbenchId, reqData).subscribe({
      next: (resp: CreateWorkBenchResp) => {
        console.log(this.decryptTreeData(resp.data, environment.crypto_secretkey));
        console.log(this.tree);
      },
      error: (err: any) => {
        console.log(err);
        this.loader.hideLoader();
      },
      complete: () => {
        setTimeout(() => {
          this.renderTree(this.tree.root);
          const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
          canvas.style.filter = 'none';
          this.loader.hideLoader();
        }, 500);
      }
    })
  }
  cloneTree(tree: Tree): Tree {
    const prototypeDescriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(tree));

    const protoClone = Object.create(null, prototypeDescriptors);

    const treeClone = Object.create(protoClone, Object.getOwnPropertyDescriptors(tree));

    return treeClone;
  }
  convertToTree(data: any): Tree {
    const tree = new Tree(data.root.id, data.root.data, data.root.date, data.root.label);
    for(const child of data.root.children) {
      this.convertToTree(child);
    }
    return tree;
  }
}
class Node {
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

class Tree {
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
