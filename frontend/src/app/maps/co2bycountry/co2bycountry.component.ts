import { environment } from '../../../environments/environment.prod';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-co2bycountry',
  templateUrl: './co2bycountry.component.html',
  styleUrls: ['./co2bycountry.component.scss']
})
export class Co2bycountryComponent {

  style = 'mapbox://styles/mapbox/light-v11';

  map: any = null;
  selectedYear = 2014; // initial year = 2014 - TODO why isn't this setting the slider's initial pos??

  constructor() { }

  //@ViewChild('slider')slider: any;

  ngOnInit() {
    const map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      center: [0, 0], // initial map center in [lon, lat]
      zoom: 2,
      attributionControl: false
    });

    this.map = map;

    map.on('load', () => {

      // remove all layers fom the map besides the continent and country layers
      // there's no need for any other layers since it's not relevant to our data
      map.getStyle().layers.forEach(function (element: { id: string; }, index: any, array: any) {
        if (element.id != 'country-label' && element.id != 'continent-label') {
          map.removeLayer(element.id);
        }
      });

      this.loadInitialData();

    });

  }

  loadInitialData() {
    const INITIAL_YEAR = 2014;
    this.map.addLayer({
      id: 'emissions',
      type: 'fill',
      source: {
        type: 'geojson',
        data: './assets/data.geojson'
      },
      paint: {
        'fill-color': {
          property: 'total_' + INITIAL_YEAR,
          type: 'exponential',
          base: 0.99999,
          stops: [
            [3, "hsl(114, 66%, 53%)"],
            [2806634, "hsl(0, 64%, 51%)"]
          ],
          default: "hsla(0, 0%, 90%, 1)" // when we have no emission data for a country for a year, display as light grey
        },
        'fill-opacity': 1
      }
    });

    this.setMapFilter(this.map, INITIAL_YEAR);
  }

  changeYear() {
    // update the map
    this.loadDataForYear(this.selectedYear);
  }

  loadDataForYear(year: number) {
    year = Number(year)
    const style = this.map.getStyle();
    style.layers.find(({ id }: { id: any }) => id === "emissions").paint['fill-color']['property'] = 'total_' + year;
    this.map.setStyle(style);
    this.setMapFilter(this.map, year);
  }


  setMapFilter(map: any, year: number) {
    map.setFilter('emissions', ['any',

      ['==', ['get', 'years_active'], 'ALL'],

      ['all',
        ['in', 'NOT', ['get', 'years_active']],
        ['any',
          ['<', year, ['to-number', ['slice', ['get', 'years_active'], 4, 8]]],
          ['>', year, ['to-number', ['slice', ['get', 'years_active'], 9, 13]]]
        ]
      ],

      ['all',
        ['in', 'IN', ['get', 'years_active']],
        ['>', year, ['to-number', ['slice', ['get', 'years_active'], 3, 7]]],
        ['<', year, ['to-number', ['slice', ['get', 'years_active'], 8, 12]]]
      ]

    ]);
  }

}
