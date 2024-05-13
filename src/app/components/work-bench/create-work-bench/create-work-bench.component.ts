import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { local } from 'd3';
import { CreateWorkBenchResp, CreateWorkbenchReq } from 'src/app/_models/work-bench/workbench.model';
import { WorkBenchService } from 'src/app/_services/workbench/workbench.service';
@Component({
  selector: 'app-create-work-bench',
  templateUrl: './create-work-bench.component.html',
  styleUrls: ['./create-work-bench.component.scss']
})
export class CreateWorkBenchComponent implements OnInit {
  public param_id: string[] = ['a98db973kwl8xp1lz94kjf0bma5pez8c64', '8xp1lz94kjf0bma5pez8c6a98db973kwl4', '4kjf0bma5pez8c64a98db973kwl8xp1lz9']
  constructor(private router: Router, public activeModal: NgbActiveModal, private workbenchService: WorkBenchService) { }

  ngOnInit(): void {
  }
  createNewWorkBench(): void {
    let workbenchId = ''
    const req: CreateWorkbenchReq = {
      name: `Workbench ${Math.floor(Math.random() * 100)}`,
      description: `Description ${Math.floor(Math.random() * 100)}`,
      data: null
    }
    this.workbenchService.createWorkBench(req).subscribe({
      next: (res: CreateWorkBenchResp) => {
        workbenchId = res._id
        localStorage.setItem('workbenchId', workbenchId)
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => {
        this.router.navigate(['/work-bench', workbenchId])
      }
    })
  }
  startFromScratch(): void {
    this.activeModal.close();
    // creating a new work bench in the backend via API call, the response id will be param_id
    // if (id) { this.router.navigate(['/work-bench', this.param_id]) }
    // else toastr.error('No such work bench found!') and redirect to dashboard
    this.router.navigate(['/work-bench', this.param_id[Math.floor(Math.random() * this.param_id.length)]])
  }
  redirectToTemplates(): void {
    this.activeModal.close();
    this.router.navigate(['/dashboard/templates'])
  }
  

}
