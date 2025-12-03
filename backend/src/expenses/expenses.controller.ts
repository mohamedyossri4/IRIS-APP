import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExpenseCategory } from './entities/expense.entity';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) { }

    @Post()
    create(@Body() createExpenseDto: CreateExpenseDto) {
        return this.expensesService.create(createExpenseDto);
    }

    @Get()
    findAll(
        @Query('category') category?: ExpenseCategory,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        if (category) {
            return this.expensesService.findByCategory(category);
        }
        if (startDate && endDate) {
            return this.expensesService.findByDateRange(new Date(startDate), new Date(endDate));
        }
        return this.expensesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.expensesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
        return this.expensesService.update(+id, updateExpenseDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.expensesService.remove(+id);
    }

    @Get('category/:category/total')
    getTotalByCategory(@Param('category') category: ExpenseCategory) {
        return this.expensesService.getTotalByCategory(category);
    }
}
