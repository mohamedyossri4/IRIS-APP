import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';

export enum InvoiceStatus {
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    PARTIALLY_PAID = 'PARTIALLY_PAID',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED',
}

@Entity('INVOICES')
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    invoiceNumber: string;

    @Column()
    customerId: number;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @Column('simple-json')
    items: Array<{
        productId?: number;
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }>;

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    tax: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    paidAmount: number;

    @Column({
        type: 'varchar',
        default: InvoiceStatus.DRAFT,
    })
    status: InvoiceStatus;

    @Column({ type: 'date', nullable: true })
    dueDate: Date;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ nullable: true })
    quotationId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
