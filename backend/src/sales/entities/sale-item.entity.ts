import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductVariation } from '../../products/entities/product-variation.entity';
import { User } from '../../users/entities/user.entity';

@Entity('sale_items')
export class SaleItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Sale, (sale) => sale.items)
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

    @ManyToOne(() => Product, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => ProductVariation, { nullable: true })
    @JoinColumn({ name: 'variation_id' })
    variation: ProductVariation;

    @Column({ nullable: true })
    type: string; // product, service

    @Column()
    name: string;

    @Column({ nullable: true })
    sku: string;

    @Column()
    quantity: number;

    @Column('decimal', { name: 'unit_price', precision: 10, scale: 2 })
    unitPrice: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'professional_id' })
    professional: User; // For services

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
