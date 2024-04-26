import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WorkOrder } from '../models/work-order';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {

  constructor(private http: HttpClient) { }

  getWorkOrder(): Observable<{ data: any[] }> {
    return this.http.get<{ data: WorkOrder[] }>(`${environment.apiUrl}/workOrderController/v1/getWorkOrder`);
  }

  createWorkOrder(WorkOrder: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/workOrderController/v1/addWorkOrder`, WorkOrder);
  }

  updateWorkOrder(WorkOrder: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/workOrderController/v1/UpdateWorkOrder`, WorkOrder);
  }

  deleteWorkOrder(WorkOrder: any): Observable<any> {
    const options = { body: WorkOrder };
    return this.http.delete(`${environment.apiUrl}/workOrderController/v1/deleteWorkOrder`, options);
  }
}
