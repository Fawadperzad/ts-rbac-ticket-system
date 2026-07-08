import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { runtimeConfig } from '../../environments/runtime-config';
import type { User } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = runtimeConfig.apiUrl || environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }

  updateRole(userId: number, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/users/${userId}/role`, { role });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${userId}`);
  }
}
