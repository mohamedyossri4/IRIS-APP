import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuotationStatus } from './entities/quotation.entity';

@Controller('quotations')
@UseGuards(JwtAuthGuard)
export class QuotationsController {
    constructor(private readonly quotationsService: QuotationsService) { }

    @Post()
    create(@Body() createQuotationDto: CreateQuotationDto) {
        return this.quotationsService.create(createQuotationDto);
    }

    @Get()
    findAll(@Query('status') status?: QuotationStatus, @Query('customerId') customerId?: string) {
        if (status) {
            return this.quotationsService.findByStatus(status);
        }
        if (customerId) {
            return this.quotationsService.findByCustomer(parseInt(customerId));
        }
        return this.quotationsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.quotationsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateQuotationDto: UpdateQuotationDto) {
        return this.quotationsService.update(+id, updateQuotationDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.quotationsService.remove(+id);
    }
}
