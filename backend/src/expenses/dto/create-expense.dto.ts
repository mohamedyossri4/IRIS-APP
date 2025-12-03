import { IsString, IsNotEmpty, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ExpenseCategory } from '../entities/expense.entity';

export class CreateExpenseDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsEnum(ExpenseCategory)
    @IsNotEmpty()
    category: ExpenseCategory;

    @IsDateString()
    @IsNotEmpty()
    expenseDate: string;

    @IsString()
    @IsOptional()
    vendor?: string;

    @IsString()
    @IsOptional()
    receipt?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
