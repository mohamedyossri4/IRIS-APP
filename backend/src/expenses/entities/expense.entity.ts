import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ExpenseCategory {
    SUPPLIES = 'SUPPLIES',
    UTILITIES = 'UTILITIES',
    RENT = 'RENT',
    SALARIES = 'SALARIES',
    MARKETING = 'MARKETING',
    TRAVEL = 'TRAVEL',
    OTHER = 'OTHER',
}

@Entity('EXPENSES')
export class Expense {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({
        type: 'varchar',
        default: ExpenseCategory.OTHER,
    })
    category: ExpenseCategory;

    @Column({ type: 'date' })
    expenseDate: Date;

    @Column({ nullable: true })
    vendor: string;

    @Column({ nullable: true })
    receipt: string; // File path or URL

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
