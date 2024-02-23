import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  public displayType: string = 'inline';
  public position: string = 'absolute';
  @Input() buttonText!: string;
  @Input() bgColor!: string;
  @Input() textColor!: string;
  @Input() width!: string;
  @Input() borderRadius!: string;
  @Input() height!: string;
  @Input() border!: string;
  @Input() topPos?: string;
  @Input() leftPos?: string;
  @Input() rightPos?: string;
  @Input() bottomPos?: string;
  @Input() padding!: string;
  @Output() clickHandler = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
    
   }
  onClick(): void {
    this.clickHandler.emit();
  }

}
