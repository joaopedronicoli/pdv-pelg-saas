import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cashier } from './entities/cashier.entity';
import { CashierMovement } from './entities/cashier-movement.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Cashier, CashierMovement])],
    controllers: [],
    providers: [],
})
export class CashierModule { }
