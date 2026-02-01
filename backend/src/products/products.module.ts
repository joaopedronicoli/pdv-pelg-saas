import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { ProductVariation } from './entities/product-variation.entity';
import { StockMovement } from './entities/stock-movement.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category, ProductVariation, StockMovement])],
    controllers: [],
    providers: [],
    exports: [TypeOrmModule],
})
export class ProductsModule { }
