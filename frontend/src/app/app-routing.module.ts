import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapListComponent } from './map-list/map-list.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'maps', component: MapListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
