import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { RegisterRequest } from '../models/user.model';

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private apiUrl = 'http://localhost:5119/api/auth';

  #tokenState = signal<string | null>(
    this.isBrowser ? localStorage.getItem('token') : null
  );

  public isAuthenticated = computed(() => !!this.#tokenState());

  public getToken(): string | null {
    return this.#tokenState();
  }

  register(userData: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, userData);
  }

  public login(username: string, password: string): Observable<LoginResponse> {
    const loginPayload = { username, password };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginPayload).pipe(
      tap(response => {
        const jwtToken = response.token;

        if (this.isBrowser && jwtToken) {
          localStorage.setItem('token', jwtToken);
        }

        this.#tokenState.set(jwtToken);
      })
    );
  }

  public logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
    this.#tokenState.set(null);
  }
}