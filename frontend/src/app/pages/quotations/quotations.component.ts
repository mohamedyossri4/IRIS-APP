import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuotationService } from '../../services/quotation.service';
import { CustomerService } from '../../services/customer.service';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
    selector: 'app-quotations',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingComponent],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Quotations</h1>
          <p class="text-muted">Manage quotations and estimates</p>
        </div>
        <button class="btn btn-primary" (click)="showForm = true">
          <span>➕</span> Create Quotation
        </button>
      </div>

      <app-loading *ngIf="loading"></app-loading>

      <div *ngIf="!loading" class="card">
        <table>
          <thead>
            <tr>
              <th>Quotation #</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Valid Until</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let q of quotations">
              <td>{{ q.quotationNumber }}</td>
              <td>{{ q.customer?.name }}</td>
              <td>\${{ q.total | number:'1.2-2' }}</td>
              <td><span class="badge badge-info">{{ q.status }}</span></td>
              <td>{{ q.validUntil | date:'short' }}</td>
              <td>
                <button class="btn btn-danger btn-sm" (click)="delete(q.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Create Quotation</h2>
          <form (ngSubmit)="save()">
            <div class="form-group">
              <label>Customer *</label>
              <select [(ngModel)]="formData.customerId" name="customerId" required>
                <option value="">Select Customer</option>
                <option *ngFor="let c of customers" [value]="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Subtotal *</label>
              <input type="number" [(ngModel)]="formData.subtotal" name="subtotal" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Tax</label>
              <input type="number" [(ngModel)]="formData.tax" name="tax" step="0.01">
            </div>
            <div class="form-group">
              <label>Total *</label>
              <input type="number" [(ngModel)]="formData.total" name="total" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Valid Until</label>
              <input type="date" [(ngModel)]="formData.validUntil" name="validUntil">
            </div>
            <div class="flex gap-2">
              <button type="submit" class="btn btn-primary">Create</button>
              <button type="button" class="btn btn-secondary" (click)="showForm = false">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page-container { padding: var(--spacing-xl); }
    .page-header { display: flex; justify-content: space-between; margin-bottom: var(--spacing-xl); }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background-color: var(--secondary-black); border: 1px solid var(--border-gray); border-radius: var(--radius-lg); padding: var(--spacing-xl); max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; }
    td button { margin-right: var(--spacing-sm); }
  `]
})
export class QuotationsComponent implements OnInit {
    quotations: any[] = [];
    customers: any[] = [];
    loading = true;
    showForm = false;
    formData: any = { items: [], tax: 0 };

    constructor(
        private service: QuotationService,
        private customerService: CustomerService
    ) { }

    ngOnInit(): void {
        this.load();
        this.customerService.getAll().subscribe(data => this.customers = data);
    }

    load(): void {
        this.service.getAll().subscribe({
            next: (data) => { this.quotations = data; this.loading = false; },
            error: (err) => { console.error(err); this.loading = false; }
        });
    }

    save(): void {
        this.formData.items = [{ description: 'Quotation item', quantity: 1, unitPrice: this.formData.subtotal, total: this.formData.subtotal }];
        this.service.create(this.formData).subscribe({ next: () => { this.load(); this.showForm = false; this.formData = { items: [], tax: 0 }; } });
    }

    delete(id: number): void {
        if (confirm('Delete this quotation?')) {
            this.service.delete(id).subscribe({ next: () => this.load() });
        }
    }
}
