import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapListComponent } from './map-list/map-list.component';
import { AboutComponent } from './about/about.component';
import { Co2bycountryComponent } from './maps/co2bycountry/co2bycountry.component';

@NgModule({
  declarations: [
    AppComponent,
    MapListComponent,
    AboutComponent,
    Co2bycountryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
