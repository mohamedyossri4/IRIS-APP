import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxConfigDto } from './dto/create-tax-config.dto';
import { UpdateTaxConfigDto } from './dto/update-tax-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tax')
@UseGuards(JwtAuthGuard)
export class TaxController {
    constructor(private readonly taxService: TaxService) { }

    @Post()
    create(@Body() createTaxConfigDto: CreateTaxConfigDto) {
        return this.taxService.create(createTaxConfigDto);
    }

    @Get()
    findAll() {
        return this.taxService.findAll();
    }

    @Get('active')
    findActive() {
        return this.taxService.findActive();
    }

    @Get('default')
    findDefault() {
        return this.taxService.findDefault();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.taxService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaxConfigDto: UpdateTaxConfigDto) {
        return this.taxService.update(+id, updateTaxConfigDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.taxService.remove(+id);
    }
}
