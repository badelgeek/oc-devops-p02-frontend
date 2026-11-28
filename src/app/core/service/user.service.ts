import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/LoginRequest';
import { LoginResponse } from '../models/LoginResponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserListResponse } from '../models/UserListResponse';
import { CreateUserRequest } from '../models/CreateUserRequest';
import { UserDetail } from '../models/UserDetail';
import { UpdateUserRequest } from '../models/UpdateUserRequest';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  private token: string | null = null;

  register(user: CreateUserRequest): Observable<void> {
    return this.httpClient.post<void>('/api/register', user);
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

  getUser(id: number): Observable<UserDetail> {
    return this.httpClient.get<UserDetail>(`/api/users/${id}`);
  }

  updateUser(id: number, user: UpdateUserRequest): Observable<UserDetail> {
    return this.httpClient.put<UserDetail>(`/api/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.httpClient.delete<void>(`/api/users/${id}`);
  }

  addUser(user: CreateUserRequest): Observable<void> {
    return this.httpClient.post<void>('/api/users', user);
  }
}
