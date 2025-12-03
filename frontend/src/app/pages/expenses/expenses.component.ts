import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
    selector: 'app-expenses',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingComponent],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Expenses</h1>
          <p class="text-muted">Track business expenses</p>
        </div>
        <button class="btn btn-primary" (click)="showForm = true">
          <span>➕</span> Add Expense
        </button>
      </div>

      <app-loading *ngIf="loading"></app-loading>

      <div *ngIf="!loading" class="card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of expenses">
              <td>{{ e.expenseDate | date:'short' }}</td>
              <td>{{ e.description }}</td>
              <td><span class="badge badge-info">{{ e.category }}</span></td>
              <td>{{ e.vendor || '-' }}</td>
              <td>\${{ e.amount | number:'1.2-2' }}</td>
              <td>
                <button class="btn btn-danger btn-sm" (click)="delete(e.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>Add Expense</h2>
          <form (ngSubmit)="save()">
            <div class="form-group">
              <label>Description *</label>
              <input type="text" [(ngModel)]="formData.description" name="description" required>
            </div>
            <div class="form-group">
              <label>Amount *</label>
              <input type="number" [(ngModel)]="formData.amount" name="amount" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Category *</label>
              <select [(ngModel)]="formData.category" name="category" required>
                <option value="SUPPLIES">Supplies</option>
                <option value="UTILITIES">Utilities</option>
                <option value="RENT">Rent</option>
                <option value="SALARIES">Salaries</option>
                <option value="MARKETING">Marketing</option>
                <option value="TRAVEL">Travel</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Expense Date *</label>
              <input type="date" [(ngModel)]="formData.expenseDate" name="expenseDate" required>
            </div>
            <div class="form-group">
              <label>Vendor</label>
              <input type="text" [(ngModel)]="formData.vendor" name="vendor">
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
export class ExpensesComponent implements OnInit {
    expenses: any[] = [];
    loading = true;
    showForm = false;
    formData: any = { category: 'OTHER' };

    constructor(private service: ExpenseService) { }

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.service.getAll().subscribe({
            next: (data) => { this.expenses = data; this.loading = false; },
            error: (err) => { console.error(err); this.loading = false; }
        });
    }

    save(): void {
        this.service.create(this.formData).subscribe({ next: () => { this.load(); this.showForm = false; this.formData = { category: 'OTHER' }; } });
    }

    delete(id: number): void {
        if (confirm('Delete this expense?')) {
            this.service.delete(id).subscribe({ next: () => this.load() });
        }
    }
}
