import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { InvoiceService } from '../../services/invoice.service';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
    selector: 'app-payments',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingComponent],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Payments</h1>
          <p class="text-muted">Track payment records</p>
        </div>
        <button class="btn btn-primary" (click)="showForm = true">
          <span>➕</span> Record Payment
        </button>
      </div>

      <app-loading *ngIf="loading"></app-loading>

      <div *ngIf="!loading" class="card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Reference</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of payments">
              <td>{{ p.paymentDate | date:'short' }}</td>
              <td>{{ p.invoice?.invoiceNumber }}</td>
              <td>{{ p.invoice?.customer?.name }}</td>
              <td>\${{ p.amount | number:'1.2-2' }}</td>
              <td><span class="badge badge-info">{{ p.paymentMethod }}</span></td>
              <td>{{ p.reference || '-' }}</td>
              <td>
                <button class="btn btn-danger btn-sm" (click)="delete(p.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Record Payment</h2>
          <form (ngSubmit)="save()">
            <div class="form-group">
              <label>Invoice *</label>
              <select [(ngModel)]="formData.invoiceId" name="invoiceId" required>
                <option value="">Select Invoice</option>
                <option *ngFor="let inv of invoices" [value]="inv.id">{{ inv.invoiceNumber }} - {{ inv.customer?.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Amount *</label>
              <input type="number" [(ngModel)]="formData.amount" name="amount" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Payment Date *</label>
              <input type="date" [(ngModel)]="formData.paymentDate" name="paymentDate" required>
            </div>
            <div class="form-group">
              <label>Payment Method *</label>
              <select [(ngModel)]="formData.paymentMethod" name="paymentMethod" required>
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="CHECK">Check</option>
              </select>
            </div>
            <div class="form-group">
              <label>Reference</label>
              <input type="text" [(ngModel)]="formData.reference" name="reference">
            </div>
            <div class="flex gap-2">
              <button type="submit" class="btn btn-primary">Save</button>
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
export class PaymentsComponent implements OnInit {
    payments: any[] = [];
    invoices: any[] = [];
    loading = true;
    showForm = false;
    formData: any = { paymentMethod: 'CASH' };

    constructor(
        private service: PaymentService,
        private invoiceService: InvoiceService
    ) { }

    ngOnInit(): void {
        this.load();
        this.invoiceService.getAll().subscribe(data => this.invoices = data);
    }

    load(): void {
        this.service.getAll().subscribe({
            next: (data) => { this.payments = data; this.loading = false; },
            error: (err) => { console.error(err); this.loading = false; }
        });
    }

    save(): void {
        this.service.create(this.formData).subscribe({ next: () => { this.load(); this.showForm = false; this.formData = { paymentMethod: 'CASH' }; } });
    }

    delete(id: number): void {
        if (confirm('Delete this payment?')) {
            this.service.delete(id).subscribe({ next: () => this.load() });
        }
    }
}
