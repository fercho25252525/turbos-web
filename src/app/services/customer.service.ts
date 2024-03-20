import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    constructor(private http: HttpClient) { }

    getCustomer(): Observable<{ data: any[] }> {
        return this.http.get<{ data: User[] }>(`${environment.apiUrl}/customerController/v1/getCustomer`);
    }

    createCustomer(user: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/customerController/v1/addCustomer`, user);
    }

    updateUser(user: any): Observable<any> {
        return this.http.put(`${environment.apiUrl}/customerController/v1/UpdateCustomer`, user);
    }

    deleteUser(customer: any): Observable<any> {
        const options = { body: customer };
        return this.http.delete(`${environment.apiUrl}/userController/v1/deleteUser`, options);
    }
}
