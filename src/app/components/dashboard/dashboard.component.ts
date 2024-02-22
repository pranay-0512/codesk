import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateWorkBenchComponent } from '../work-bench/create-work-bench/create-work-bench.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    console.log("Dashboard Component Loaded!")
  }
  createNewBoard(): void {
    const modalRef = this.modalService.open(CreateWorkBenchComponent, { size: 'lg', backdrop: 'static', keyboard: true } );
  }
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
  goToRegister(): void {
    this.router.navigate(['/auth/signup']);
  }

}
