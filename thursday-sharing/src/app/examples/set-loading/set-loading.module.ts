import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetLoadingComponent } from './set-loading.component';
import { RouterModule, Routes } from '@angular/router';
import { LoadingService } from './loading.service';

const routes: Routes = [
  {
    path: '**',
    pathMatch: 'full',
    component: SetLoadingComponent,
  },
];

@NgModule({
  declarations: [
    SetLoadingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    LoadingService,
  ],
})
export class SetLoadingModule { }
