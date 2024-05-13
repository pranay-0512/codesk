import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { CreateWorkbenchReq, CreateWorkBenchResp } from './_models/work-bench/workbench.model';
import { WorkBenchService } from './_services/workbench/workbench.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private titleService: Title, private workbenchService: WorkBenchService, private location: Location) {}
  ngOnInit() {
    this.location.replaceState('/work-bench');
    this.checkForWorkbenchId();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.router.routerState.root),
        map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        this.titleService.setTitle(data['title'] || 'coCanvas');
      });
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

  checkForWorkbenchId(): void {
    const workbenchId = localStorage.getItem('workbenchId')

    if (workbenchId) {
      this.workbenchService.getWorkBench(workbenchId).subscribe({
        next: (res) => {
          if (res) {
            this.router.navigate(['/work-bench', workbenchId])
          } else {
            this.createNewWorkBench()
          }
        },
        error: (err) => {
          console.error(err)
          this.createNewWorkBench()
        }
      })
    } else {
      this.createNewWorkBench()
    }
  }
}
