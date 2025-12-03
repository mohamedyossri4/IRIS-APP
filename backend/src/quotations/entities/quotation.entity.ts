import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';

export enum QuotationStatus {
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
}

@Entity('QUOTATIONS')
export class Quotation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    quotationNumber: string;

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

    @Column({
        type: 'varchar',
        default: QuotationStatus.DRAFT,
    })
    status: QuotationStatus;

    @Column({ type: 'date', nullable: true })
    validUntil: Date;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
