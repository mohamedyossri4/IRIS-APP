import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ContractService {
    private apiUrl = `${environment.apiUrl}/contracts`;

    constructor(private http: HttpClient) { }

    getAll(status?: string, customerId?: number): Observable<any[]> {
        let params = new HttpParams();
        if (status) params = params.set('status', status);
        if (customerId) params = params.set('customerId', customerId.toString());
        return this.http.get<any[]>(this.apiUrl, { params });
    }

    getExpiring(days?: number): Observable<any[]> {
        let params = new HttpParams();
        if (days) params = params.set('days', days.toString());
        return this.http.get<any[]>(`${this.apiUrl}/expiring`, { params });
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
