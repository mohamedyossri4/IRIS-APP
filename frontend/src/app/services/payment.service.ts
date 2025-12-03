import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = `${environment.apiUrl}/payments`;

    constructor(private http: HttpClient) { }

    getAll(invoiceId?: number): Observable<any[]> {
        let params = new HttpParams();
        if (invoiceId) params = params.set('invoiceId', invoiceId.toString());
        return this.http.get<any[]>(this.apiUrl, { params });
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
