import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { TaxConfig } from './entities/tax-config.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TaxConfig])],
    controllers: [TaxController],
    providers: [TaxService],
    exports: [TaxService],
})
export class TaxModule { }
