import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapListComponent } from './map-list/map-list.component';
import { AboutComponent } from './about/about.component';
import { Co2bycountryComponent } from './maps/co2bycountry/co2bycountry.component';

const routes: Routes = [
  { path: '', redirectTo: '/maps', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'maps', component: MapListComponent },
  { path: 'maps/co2bycountry', component: Co2bycountryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
