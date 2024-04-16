import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Node, Tree, VersionControlService } from 'src/app/_services/version-control/version-control.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('graphSvg', {static: true}) graphContainer: ElementRef | undefined;
  @Input() encryptedTreeData!: string;
  @Output() emitCurrentNodeId = new EventEmitter<string>();

  public isCollapsed = false;
  constructor(private snapshotService: VersionControlService ) {
    window.addEventListener('storage', (event) => {
      console.log(event)
      // localStorage.setItem('cocanvas_shapes', event.newValue!);
    })
  }
  ngOnInit(): void {
  }
  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    if(this.isCollapsed) {
      const mapContainer = document.getElementById('map-container');
      const arrow = document.getElementById('arrow');
      if (mapContainer && arrow) {
        mapContainer.style.width = '30%';
        arrow.style.right = '30%';
        // arrow.style.transform = 'rotate(180deg)';
      }
    }
    else {
      const mapContainer = document.getElementById('map-container');
      const arrow = document.getElementById('arrow');
      if (mapContainer && arrow) {
        mapContainer.style.width = '0px';
        arrow.style.right = '0%';
        // arrow.style.transform = 'rotate(0deg)';
      }
    
    }
  }
  renderTree(tree: Node): void {
    // remove the existing svg
    d3.select(this.graphContainer?.nativeElement).selectAll('svg').remove();
    const width = document.body.clientWidth * 0.3;
    const height = document.body.clientHeight * 0.6;
    const svg = d3.select(this.graphContainer?.nativeElement)
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height+10)
                  .attr('margin-right', '10px');
    const treeLayout = d3.tree<Node>()
                        .size([width, height-50]);
    const rootNode = d3.hierarchy(tree);
    const treeNodes = treeLayout(rootNode);

    // Render nodes as circles
    const nodes = svg.selectAll('.node')
      .data(treeNodes.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

    nodes.append('circle')
        .attr('r', 15)
        .style('fill', 'black')
        .style('stroke', 'white') // Add stroke for better visibility
        .style('stroke-width', 2) // Increase stroke width for better visibility
        .style('cursor', 'pointer')
        .style('fill', (d: any) => d.data.id === this.snapshotService.versionTree.currentNode?.id ? 'red' : 'black')
        .on('click', (event, d) => {
          this.emitCurrentNodeId.emit(d.data.id);
          d3.select(event.target)
            .transition()
            .duration(500)
            .style('fill', 'red');
          this.renderCanvas(d.data);
        })
        .append('title')
        .text((d: any) => d.data.label);
    
    // Render labels for each node on the side
    nodes.append('text')
        .attr('dy', 5)
        .attr('x', 20) // Adjust the distance from the node
        .attr('text-anchor', 'start')
        .attr('font-size', '12px')
        .style('fill', 'white')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .style('cursor', 'pointer')
        .text((d: any) => d.data.label);

    // Render links as lines
    svg.selectAll('.link')
      .data(treeNodes.links())
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)
        .style('stroke', 'black')
        .style('stroke-width', 2); // Increase stroke width for better visibility
  }
  renderCanvas(data: any): void {
    if(data.data == null) {return;}
    const cocanvas_shapes = JSON.parse(data.data);
    console.log(cocanvas_shapes)
    localStorage.setItem('cocanvas_shapes', JSON.stringify(cocanvas_shapes));
  }
  decryptTreeData(encryptedData: string, key: string): any {
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
      const decryptedObject = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
      return decryptedObject;
    } catch (error) {
      console.error('Decryption failed:', error);
      return null; // or handle the error in a different way
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(!changes['encryptedTreeData'].firstChange){
      if(changes['encryptedTreeData'].currentValue){
        const decryptedData: Tree = this.decryptTreeData(changes['encryptedTreeData'].currentValue, environment.crypto_secretkey);
        console.log(decryptedData)
        this.renderTree(decryptedData.root);
      }
    }
  }
}
