import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usermodel } from '../models/usermodel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'https://localhost:7286/api/Users';
  constructor(private http: HttpClient) { }

  getUser(userId: number){
    return this.http.get(`${this.userUrl}/${userId}`)
  }

  addUser(userModel: Usermodel){
    return this.http.post(`${this.userUrl}`, userModel)
  }
}
