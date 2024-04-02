import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inventory } from '../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) { }

  getInventory(): Observable<{ data: any[] }> {
    return this.http.get<{ data: Inventory[] }>(`${environment.apiUrl}/inventoryController/v1/getInventory`);
  }

  createInventory(inventory: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/inventoryController/v1/addInventory`, inventory);
  }

  updateInventory(inventory: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/inventoryController/v1/UpdateInventory`, inventory);
  }

  deleteInventory(inventory: any): Observable<any> {
    const options = { body: inventory };
    return this.http.delete(`${environment.apiUrl}/inventoryController/v1/deleteInventory`, options);
  }
}
