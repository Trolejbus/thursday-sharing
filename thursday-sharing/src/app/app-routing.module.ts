import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'nice-date-pipe',
    loadChildren: () => import('./examples/nice-date-pipe/nice-date-pipe.module').then(m => m.NiceDatePipeModule),
  },
  {
    path: '**',
    pathMatch: 'full', 
    redirectTo: '/nice-date-pipe',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
