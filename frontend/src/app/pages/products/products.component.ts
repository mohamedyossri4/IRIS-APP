import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingComponent],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Products & Services</h1>
          <p class="text-muted">Manage your product catalog</p>
        </div>
        <button class="btn btn-primary" (click)="showForm = true; editingItem = null">
          <span>➕</span> Add Product
        </button>
      </div>

      <app-loading *ngIf="loading"></app-loading>

      <div *ngIf="!loading" class="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td>{{ product.name }}</td>
              <td>{{ product.description || '-' }}</td>
              <td>\${{ product.price | number:'1.2-2' }}</td>
              <td><span class="badge badge-info">{{ product.type }}</span></td>
              <td>
                <button class="btn btn-secondary btn-sm" (click)="edit(product)">Edit</button>
                <button class="btn btn-danger btn-sm" (click)="delete(product.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="showForm" class="modal-overlay" (click)="showForm = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{ editingItem ? 'Edit Product' : 'Add Product' }}</h2>
          <form (ngSubmit)="save()">
            <div class="form-group">
              <label>Name *</label>
              <input type="text" [(ngModel)]="formData.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="formData.description" name="description" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Price *</label>
              <input type="number" [(ngModel)]="formData.price" name="price" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Type</label>
              <select [(ngModel)]="formData.type" name="type">
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
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
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-xl); }
    .page-header h1 { margin-bottom: var(--spacing-sm); }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background-color: var(--secondary-black); border: 1px solid var(--border-gray); border-radius: var(--radius-lg); padding: var(--spacing-xl); max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; }
    .modal-content h2 { margin-bottom: var(--spacing-lg); }
    td button { margin-right: var(--spacing-sm); }
  `]
})
export class ProductsComponent implements OnInit {
    products: any[] = [];
    loading = true;
    showForm = false;
    editingItem: any = null;
    formData: any = { type: 'service' };

    constructor(private service: ProductService) { }

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.service.getAll().subscribe({
            next: (data) => { this.products = data; this.loading = false; },
            error: (err) => { console.error(err); this.loading = false; }
        });
    }

    edit(item: any): void {
        this.editingItem = item;
        this.formData = { ...item };
        this.showForm = true;
    }

    save(): void {
        const obs = this.editingItem
            ? this.service.update(this.editingItem.id, this.formData)
            : this.service.create(this.formData);
        obs.subscribe({ next: () => { this.load(); this.showForm = false; this.formData = { type: 'service' }; } });
    }

    delete(id: number): void {
        if (confirm('Delete this product?')) {
            this.service.delete(id).subscribe({ next: () => this.load() });
        }
    }
}
