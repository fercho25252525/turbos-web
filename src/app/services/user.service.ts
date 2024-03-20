import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Role, User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {



  constructor(private http: HttpClient) { }

  getUsers(): Observable<{ data: User[] }> {
    return this.http.get<{ data: User[] }>(`${environment.apiUrl}/userController/v1/getUsers`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/userController/v1/addUsers`, user);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/userController/v1/UpdateUsers`, user);
  }

  deleteUser(user: User): Observable<any> {
    const options = { body: user };
    return this.http.delete(`${environment.apiUrl}/userController/v1/deleteUser`, options);
  }

  getRole(): Observable<{ data: Role[] }> {
    return this.http.get<{ data: Role[] }>(`${environment.apiUrl}/userController/v1/getRoles`);
  }

  uploadImage(imageFile: File, userName: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('userName', userName);

    return this.http.post<any>(`${environment.apiUrl}/userController/v1/upload`, formData);
  }

  getImage(userName: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/userController/v1/sendImage/${userName}`, { responseType: 'blob' });
  }
}
