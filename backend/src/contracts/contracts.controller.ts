import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContractStatus } from './entities/contract.entity';

@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
    constructor(private readonly contractsService: ContractsService) { }

    @Post()
    create(@Body() createContractDto: CreateContractDto) {
        return this.contractsService.create(createContractDto);
    }

    @Get()
    findAll(@Query('status') status?: ContractStatus, @Query('customerId') customerId?: string) {
        if (status) {
            return this.contractsService.findByStatus(status);
        }
        if (customerId) {
            return this.contractsService.findByCustomer(parseInt(customerId));
        }
        return this.contractsService.findAll();
    }

    @Get('expiring')
    findExpiring(@Query('days') days?: string) {
        const daysNumber = days ? parseInt(days) : 30;
        return this.contractsService.findExpiring(daysNumber);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.contractsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
        return this.contractsService.update(+id, updateContractDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.contractsService.remove(+id);
    }

    @Post('check-expired')
    checkExpired() {
        return this.contractsService.checkExpiredContracts();
    }
}
