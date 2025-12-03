import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
    selector: 'app-customers',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, LoadingComponent],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Customers</h1>
          <p class="text-muted">Manage your customer database</p>
        </div>
        <button class="btn btn-primary" (click)="showForm = true; editingCustomer = null">
          <span>➕</span> Add Customer
        </button>
      </div>

      <app-loading *ngIf="loading"></app-loading>

      <div *ngIf="!loading" class="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Tax ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let customer of customers">
              <td>{{ customer.name }}</td>
              <td>{{ customer.email || '-' }}</td>
              <td>{{ customer.phone || '-' }}</td>
              <td>{{ customer.taxId || '-' }}</td>
              <td>
                <button class="btn btn-secondary btn-sm" (click)="editCustomer(customer)">Edit</button>
                <button class="btn btn-danger btn-sm" (click)="deleteCustomer(customer.id)">Delete</button>
              </td>
            </tr>
            <tr *ngIf="customers.length === 0">
              <td colspan="5" class="text-center text-muted">No customers found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{ editingCustomer ? 'Edit Customer' : 'Add Customer' }}</h2>
          <form (ngSubmit)="saveCustomer()">
            <div class="form-group">
              <label>Name *</label>
              <input type="text" [(ngModel)]="formData.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="formData.email" name="email">
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="text" [(ngModel)]="formData.phone" name="phone">
            </div>
            <div class="form-group">
              <label>Address</label>
              <textarea [(ngModel)]="formData.address" name="address" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Tax ID</label>
              <input type="text" [(ngModel)]="formData.taxId" name="taxId">
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
    .page-container {
      padding: var(--spacing-xl);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-xl);
    }

    .page-header h1 {
      margin-bottom: var(--spacing-sm);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: var(--secondary-black);
      border: 1px solid var(--border-gray);
      border-radius: var(--radius-lg);
      padding: var(--spacing-xl);
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-content h2 {
      margin-bottom: var(--spacing-lg);
    }

    td button {
      margin-right: var(--spacing-sm);
    }
  `]
})
export class CustomersComponent implements OnInit {
    customers: any[] = [];
    loading = true;
    showForm = false;
    editingCustomer: any = null;
    formData: any = {};

    constructor(private customerService: CustomerService) { }

    ngOnInit(): void {
        this.loadCustomers();
    }

    loadCustomers(): void {
        this.customerService.getAll().subscribe({
            next: (data) => {
                this.customers = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading customers:', err);
                this.loading = false;
            }
        });
    }

    editCustomer(customer: any): void {
        this.editingCustomer = customer;
        this.formData = { ...customer };
        this.showForm = true;
    }

    saveCustomer(): void {
        if (this.editingCustomer) {
            this.customerService.update(this.editingCustomer.id, this.formData).subscribe({
                next: () => {
                    this.loadCustomers();
                    this.showForm = false;
                    this.formData = {};
                }
            });
        } else {
            this.customerService.create(this.formData).subscribe({
                next: () => {
                    this.loadCustomers();
                    this.showForm = false;
                    this.formData = {};
                }
            });
        }
    }

    deleteCustomer(id: number): void {
        if (confirm('Are you sure you want to delete this customer?')) {
            this.customerService.delete(id).subscribe({
                next: () => {
                    this.loadCustomers();
                }
            });
        }
    }
}
