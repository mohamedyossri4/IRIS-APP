import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContractService } from '../../services/contract.service';
import { CustomerService } from '../../services/customer.service';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
    selector: 'app-contracts',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingComponent],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Contracts</h1>
          <p class="text-muted">Manage customer contracts</p>
        </div>
        <button class="btn btn-primary" (click)="showForm = true">
          <span>➕</span> Add Contract
        </button>
      </div>

      <app-loading *ngIf="loading"></app-loading>

      <div *ngIf="!loading" class="card">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Customer</th>
              <th>Value</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of contracts">
              <td>{{ c.title }}</td>
              <td>{{ c.customer?.name }}</td>
              <td>\${{ c.value | number:'1.2-2' }}</td>
              <td>{{ c.startDate | date:'short' }}</td>
              <td>{{ c.endDate | date:'short' }}</td>
              <td><span class="badge" [ngClass]="c.status === 'ACTIVE' ? 'badge-success' : 'badge-gray'">{{ c.status }}</span></td>
              <td>
                <button class="btn btn-danger btn-sm" (click)="delete(c.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Add Contract</h2>
          <form (ngSubmit)="save()">
            <div class="form-group">
              <label>Customer *</label>
              <select [(ngModel)]="formData.customerId" name="customerId" required>
                <option value="">Select Customer</option>
                <option *ngFor="let cust of customers" [value]="cust.id">{{ cust.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Title *</label>
              <input type="text" [(ngModel)]="formData.title" name="title" required>
            </div>
            <div class="form-group">
              <label>Value *</label>
              <input type="number" [(ngModel)]="formData.value" name="value" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Start Date *</label>
              <input type="date" [(ngModel)]="formData.startDate" name="startDate" required>
            </div>
            <div class="form-group">
              <label>End Date *</label>
              <input type="date" [(ngModel)]="formData.endDate" name="endDate" required>
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
export class ContractsComponent implements OnInit {
    contracts: any[] = [];
    customers: any[] = [];
    loading = true;
    showForm = false;
    formData: any = {};

    constructor(
        private service: ContractService,
        private customerService: CustomerService
    ) { }

    ngOnInit(): void {
        this.load();
        this.customerService.getAll().subscribe(data => this.customers = data);
    }

    load(): void {
        this.service.getAll().subscribe({
            next: (data) => { this.contracts = data; this.loading = false; },
            error: (err) => { console.error(err); this.loading = false; }
        });
    }

    save(): void {
        this.service.create(this.formData).subscribe({ next: () => { this.load(); this.showForm = false; this.formData = {}; } });
    }

    delete(id: number): void {
        if (confirm('Delete this contract?')) {
            this.service.delete(id).subscribe({ next: () => this.load() });
        }
    }
}
