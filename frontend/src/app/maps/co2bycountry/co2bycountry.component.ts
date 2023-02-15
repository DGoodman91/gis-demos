import { environment } from '../../../environments/environment.prod';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-co2bycountry',
  templateUrl: './co2bycountry.component.html',
  styleUrls: ['./co2bycountry.component.scss']
})
export class Co2bycountryComponent {

  style = 'mapbox://styles/mapbox/light-v11';

  constructor() { }

  ngOnInit() {
    const map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      center: [0, 0], // initial map center in [lon, lat]
      zoom: 2,
      attributionControl: false
    });

//    map.getStyle().layers.forEach(function (element: { id: string; }, index: any, array: any) {
//      if (element.id != 'country-label' && element.id != 'continent-label') {
//        map.removeLayer(element.id);
//      }
//    });

  }

}
