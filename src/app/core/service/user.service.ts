import { Injectable } from '@angular/core';
import { RegisterRequest } from '../models/RegisterRequest';
import { LoginRequest } from '../models/LoginRequest';
import { LoginResponse } from '../models/LoginResponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserListResponse } from '../models/UserListResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  private token: string | null = null;

  register(user: RegisterRequest): Observable<Object> {
    return this.httpClient.post('/api/register', user);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/api/login', credentials);
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  getUsers(): Observable<UserListResponse> {
    return this.httpClient.get<UserListResponse>('/api/users');
  }
}
