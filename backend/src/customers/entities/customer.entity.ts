import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CustomerType {
    COMPANY = 'COMPANY',
    INDIVIDUAL = 'INDIVIDUAL',
}

@Entity('CUSTOMERS')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    taxId: string; // VAT or Tax ID

    @Column({
        type: 'varchar',
        default: CustomerType.INDIVIDUAL,
    })
    customerType: CustomerType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
