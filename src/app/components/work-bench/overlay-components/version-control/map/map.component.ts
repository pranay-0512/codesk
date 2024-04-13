import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Edge, Graph, Node } from 'src/app/_services/version-control/version-control.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('graphContainer') graphContainer: ElementRef | undefined;
  @Input() nodeData!: Node[]
  @Input() edgeData!: Edge[]
  constructor() { }
  ngOnInit(): void {
    
  }
  renderGraph(): void {
    if (this.graphContainer) {
        const svg = d3.select(this.graphContainer.nativeElement)
            .append('svg')
            .attr('width', 800)
            .attr('height', 600); // Adjust dimensions as needed

        // Calculate positions for nodes and edges
        const nodeCount = this.nodeData.length;
        const edgeCount = this.edgeData.length;
        const radius = 20; // Radius of the circle
        const lineLength = 100; // Length of the edges

        // Render edges
        svg.selectAll("line")
            .data(this.edgeData)
            .enter()
            .append("line")
            .attr("x1", (d: Edge, i: number) => {
                const angle = (360 / edgeCount) * i;
                return 400 + (radius * Math.cos(angle * (Math.PI / 180)));
            })
            .attr("y1", (d: any, i: number) => {
                const angle = (360 / edgeCount) * i;
                return 300 + (radius * Math.sin(angle * (Math.PI / 180)));
            })
            .attr("x2", (d: any, i: number) => {
                const angle = (360 / edgeCount) * i;
                return 400 + ((radius + lineLength) * Math.cos(angle * (Math.PI / 180)));
            })
            .attr("y2", (d: any, i: number) => {
                const angle = (360 / edgeCount) * i;
                return 300 + ((radius + lineLength) * Math.sin(angle * (Math.PI / 180)));
            })
            .style("stroke", "black"); // Adjust stroke color and other attributes as needed

        // Render nodes
        svg.selectAll("circle")
            .data(this.nodeData)
            .enter()
            .append("circle")
            .attr("cx", (d: Node, i: number) => {
                const angle = (360 / nodeCount) * i;
                return 400 + (radius * Math.cos(angle * (Math.PI / 180)));
            })
            .attr("cy", (d: any, i: number) => {
                const angle = (360 / nodeCount) * i;
                return 300 + (radius * Math.sin(angle * (Math.PI / 180)));
            })
            .attr("r", 10) // Adjust radius as needed
            .style("fill", "black") // Adjust fill color and other attributes as needed
            .style("cursor", "pointer") // Change cursor to pointer when hovered
            .on("click", (event: any, d: Node) => {
                // Handle node click event here, `d` represents the data bound to the clicked node
                console.log("Node clicked:", d);
            });
    }
}

  ngOnChanges(changes: SimpleChanges): void {
    // every time the input changes, re-render the graph
    this.renderGraph();
  }
}
