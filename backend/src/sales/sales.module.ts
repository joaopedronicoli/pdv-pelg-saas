import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { Payment } from './entities/payment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Sale, SaleItem, Payment])],
    controllers: [],
    providers: [],
})
export class SalesModule { }
