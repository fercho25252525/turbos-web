import { HttpClient } from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  constructor(private http: HttpClient) { }

  getProvider(): Observable<{ data: any[] }> {
    return this.http.get<{ data: Provider[] }>(`${environment.apiUrl}/providerController/v1/getProvider`);
  }

  createProvider(provider: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/providerController/v1/addProvider`, provider);
  }

  updateProvider(provider: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/providerController/v1/UpdateProvider`, provider);
  }

  deleteProvider(provider: any): Observable<any> {
    const options = { body: provider };
    return this.http.delete(`${environment.apiUrl}/providerController/v1/deleteProvider`, options);
  }
} 
