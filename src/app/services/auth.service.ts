import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Payload } from '../models/payload';

const url = 'http://localhost:8080/';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user!: User | null;
  private _token!: string | null;
  payload!: Payload;

  constructor(private http: HttpClient) { }

  public get user(): User | null{
    if (this._user != null) {
      return this._user;
    } else if (this._user == null && sessionStorage.getItem('usuario') != null) {
      this._user = JSON.parse(sessionStorage.getItem('usuario')!) as User;
      return this._user;
    }
    return new User;
  }

  public get token(): string  | null{
    
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }
   

  login(user: User):Observable<any>{
    const credentials = btoa('turb0s/tr4ck' + ':' + '/Turb0ckTr4cks2o2A/')
    console.log("credentials: Basic " + atob('dHVyYjBz8XRyNGNrOvFUdXJiMGNrVHI0Y2tzMm8yQfE='));
    console.log("credentials: Basic 2" + atob('dHVyYjBzw7F0cjRjazrDsVR1cmIwY2tUcjRja3MybzJBw7E='));
    
    const httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + credentials})
    let params = new URLSearchParams();
    params.set('grant_type', 'password')
    params.set('username', user.userName)
    params.set('password', user.password)
    return this.http.post<any>(url+'oauth/token', params.toString(), {headers: httpHeaders});
  }

  saveUser(accessToken: string):void{
    let payload = this.getDataToken(accessToken);
    this._user = new User();
    this._user.name = payload.name;
    this._user.lastName = payload.lasName;
    this._user.email = payload.email;
    this._user.userName = payload.user_name;
    this._user.roles = payload.authorities;

    sessionStorage.setItem('user', JSON.stringify(this._user));
  }

  saveToken(accessToken: string):void{
    console.log(accessToken);
    
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  getDataToken(accessToken: string): any{
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.getDataToken(this.token!);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean {
    if (this.user!.roles.includes(role)) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = null;
    this._user = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }
}
