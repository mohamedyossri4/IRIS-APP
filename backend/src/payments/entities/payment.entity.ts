import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from '../../invoices/entities/invoice.entity';

export enum PaymentMethod {
    CASH = 'CASH',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CREDIT_CARD = 'CREDIT_CARD',
    CHECK = 'CHECK',
    OTHER = 'OTHER',
}

@Entity('PAYMENTS')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    invoiceId: number;

    @ManyToOne(() => Invoice)
    @JoinColumn({ name: 'invoiceId' })
    invoice: Invoice;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'date' })
    paymentDate: Date;

    @Column({
        type: 'varchar',
        default: PaymentMethod.CASH,
    })
    paymentMethod: PaymentMethod;

    @Column({ nullable: true })
    reference: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
