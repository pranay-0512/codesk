import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateWorkbenchReq, UpdateWorkBenchReq } from 'src/app/_models/work-bench/workbench.model';

@Injectable({
  providedIn: 'root'
})
export class WorkBenchService {

  constructor(private http: HttpClient) { }

  createWorkBench(data: CreateWorkbenchReq): Observable<any> {
    return this.http.post('http://localhost:3000/workbench/create', data);
  }

  getWorkBench(id: string): Observable<any> {
    return this.http.get(`http://localhost:3000/workbench/${id}`);
  }

  updateWorkBench(id: string, data: UpdateWorkBenchReq): Observable<any> {
    return this.http.patch(`http://localhost:3000/workbench/${id}`, data);
  }
}
