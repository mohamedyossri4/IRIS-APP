import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Expense, ExpenseCategory } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectRepository(Expense)
        private expensesRepository: Repository<Expense>,
    ) { }

    create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
        const expense = this.expensesRepository.create(createExpenseDto);
        return this.expensesRepository.save(expense);
    }

    findAll(): Promise<Expense[]> {
        return this.expensesRepository.find({
            order: { expenseDate: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Expense> {
        const expense = await this.expensesRepository.findOne({ where: { id } });
        if (!expense) {
            throw new NotFoundException(`Expense with ID ${id} not found`);
        }
        return expense;
    }

    async update(id: number, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
        const expense = await this.findOne(id);
        Object.assign(expense, updateExpenseDto);
        return this.expensesRepository.save(expense);
    }

    async remove(id: number): Promise<void> {
        const result = await this.expensesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Expense with ID ${id} not found`);
        }
    }

    async findByCategory(category: ExpenseCategory): Promise<Expense[]> {
        return this.expensesRepository.find({
            where: { category },
            order: { expenseDate: 'DESC' },
        });
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
        return this.expensesRepository.find({
            where: {
                expenseDate: Between(startDate, endDate),
            },
            order: { expenseDate: 'DESC' },
        });
    }

    async getTotalByCategory(category: ExpenseCategory): Promise<number> {
        const result = await this.expensesRepository
            .createQueryBuilder('expense')
            .select('SUM(expense.amount)', 'total')
            .where('expense.category = :category', { category })
            .getRawOne();
        return Number(result.total) || 0;
    }
}
