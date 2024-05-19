import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() inputData: any;
  constructor(private activeModal: NgbActiveModal) { }
  ngOnInit(): void {
      
  }
  onCancel(): void {
    this.activeModal.close('cancel');
  }

  onProceed(): void {
    this.activeModal.close('proceed');
  }
}
