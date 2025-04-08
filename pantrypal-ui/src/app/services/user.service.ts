import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usermodel } from '../models/usermodel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'https://localhost:7286/api/Users';
  constructor(private http: HttpClient) { }

  getUser(userId: number){
    return this.http.get(`${this.userUrl}/${userId}`);
  }

  addUser(userModel: Usermodel){
    return this.http.post(`${this.userUrl}`, userModel);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}/login`, data);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }




}
