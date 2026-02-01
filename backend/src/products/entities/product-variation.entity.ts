import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variations')
export class ProductVariation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    sku: string;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    price: number;

    @Column({ name: 'stock_quantity', nullable: true })
    stockQuantity: number;

    @Column({ type: 'jsonb', nullable: true })
    attributes: any;

    @Column({ name: 'woocommerce_id', nullable: true })
    woocommerceId: string;
}
