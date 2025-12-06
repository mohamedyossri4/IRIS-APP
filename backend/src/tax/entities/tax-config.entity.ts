import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('TAX_CONFIGS')
export class TaxConfig {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', { precision: 5, scale: 2 })
    rate: number; // Percentage (e.g., 20.00 for 20%)

    @Column({ default: false })
    isDefault: boolean;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'varchar2', length: 4000, nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
