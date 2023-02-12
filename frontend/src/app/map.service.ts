import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Map } from './map'
import { MAPS } from './maps'

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  getMaps(): Observable<Map[]> {
    return of(MAPS);
  }

}
