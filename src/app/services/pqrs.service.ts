import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pqrs } from '../models/pqrs';

@Injectable({
  providedIn: 'root'
})
export class PqrsService {

  constructor(private http: HttpClient) { }

  getPqrs(): Observable<{ data: any[] }> {
    return this.http.get<{ data: Pqrs[] }>(`${environment.apiUrl}/pqrsController/v1/getPqrs`);
  }

  createPqrs(pqrs: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/pqrsController/v1/addPqrs`, pqrs);
  }

  updatePqrs(pqrs: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/pqrsController/v1/UpdatePqrs`, pqrs);
  }

  deletePqrs(pqrs: any): Observable<any> {
    const options = { body: pqrs };
    return this.http.delete(`${environment.apiUrl}/pqrsController/v1/deletePqrs`, options);
  }
}
