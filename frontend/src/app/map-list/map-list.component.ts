import { Component } from '@angular/core';
import { MAPS } from '../maps';

@Component({
  selector: 'app-map-list',
  templateUrl: './map-list.component.html',
  styleUrls: ['./map-list.component.scss']
})
export class MapListComponent {
  maps = MAPS;
}
