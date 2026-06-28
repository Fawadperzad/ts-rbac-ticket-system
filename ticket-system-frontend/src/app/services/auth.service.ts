import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  role: string; // 'USER', 'AGENT', 'ADMIN'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  
  // Speichert den aktuell eingeloggten User (Standard: null)
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Versuche den User aus dem SessionStorage zu laden, falls die Seite neu geladen wird
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // Alle User für das Auswahl-Menü laden
  getAvailableUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // Einloggen
  login(username: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username }).pipe(
      tap(user => {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  // Ausloggen
  logout() {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Hilfsmethode, um den aktuellen User-Wert direkt zu bekommen
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}