import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) { }

    getStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/stats`);
    }

    getMonthlyRevenue(year?: number): Observable<any[]> {
        let params = new HttpParams();
        if (year) params = params.set('year', year.toString());
        return this.http.get<any[]>(`${this.apiUrl}/revenue/monthly`, { params });
    }

    getTopCustomers(limit?: number): Observable<any[]> {
        let params = new HttpParams();
        if (limit) params = params.set('limit', limit.toString());
        return this.http.get<any[]>(`${this.apiUrl}/customers/top`, { params });
    }

    getRecentPayments(limit?: number): Observable<any[]> {
        let params = new HttpParams();
        if (limit) params = params.set('limit', limit.toString());
        return this.http.get<any[]>(`${this.apiUrl}/payments/recent`, { params });
    }

    getOverdueInvoices(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/invoices/overdue`);
    }
}
