import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TaxService {
    private apiUrl = `${environment.apiUrl}/tax`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getActive(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/active`);
    }

    getDefault(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/default`);
    }

    getOne(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    create(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, data);
    }

    update(id: number, data: any): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
