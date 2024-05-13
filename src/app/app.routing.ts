import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'work-bench', loadChildren: () => import('./components/work-bench/work-bench.module').then(m => m.WorkBenchModule) },
  { path: '', redirectTo: '/work-bench', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
