import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
    access_token: string;
    user: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    private tokenKey = 'auth_token';
    private userSubject = new BehaviorSubject<any>(null);
    public user$ = this.userSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadUser();
    }

    register(username: string, password: string, fullName?: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`, { username, password, fullName });
    }

    login(username: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password })
            .pipe(
                tap(response => {
                    localStorage.setItem(this.tokenKey, response.access_token);
                    this.userSubject.next(response.user);
                })
            );
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private loadUser(): void {
        const token = this.getToken();
        if (token) {
            // In a real app, you might want to validate the token with the backend
            // For now, we'll just check if it exists
            this.userSubject.next({ token });
        }
    }
}
