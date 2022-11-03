import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NiceDatePipeComponent } from './nice-date-pipe.component';
import { NiceDateTimePipe } from './nice-date-time.pipe';

const routes: Routes = [
  {
    path: '**',
    pathMatch: 'full',
    component: NiceDatePipeComponent,
  },
];

@NgModule({
  declarations: [
    NiceDatePipeComponent,
    NiceDateTimePipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
})
export class NiceDatePipeModule { }
