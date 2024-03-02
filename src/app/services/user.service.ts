import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Role, User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<{ data: User[] }> {
    return this.http.get<{ data: User[] }>(`${this.apiUrl}/userController/v1/getUsers`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/userController/v1/addUsers`, user);
  }

  getRole(): Observable<{ data: Role[] }> {
    return this.http.get<{ data: Role[] }>(`${this.apiUrl}/userController/v1/getRoles`);
  }
}
