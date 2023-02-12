import { Component } from '@angular/core';
import { Map } from '../map';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map-list',
  templateUrl: './map-list.component.html',
  styleUrls: ['./map-list.component.scss']
})
export class MapListComponent {
  maps: Map[] = [];

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.getMaps();
  }

  getMaps(): void {
    this.mapService.getMaps().subscribe(maps => this.maps = maps);
  }

}
