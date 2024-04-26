import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Vehicle } from '../models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) { }

  getVehicle(): Observable<{ data: any[] }> {
    return this.http.get<{ data: Vehicle[] }>(`${environment.apiUrl}/vehicleController/v1/getVehicle`);
  }
}
