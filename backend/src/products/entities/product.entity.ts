import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './category.entity';

export enum ProductType {
    PRODUCT = 'product',
    SERVICE = 'service',
}

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ProductType,
        default: ProductType.PRODUCT,
    })
    type: ProductType;

    @Column()
    name: string;

    @Column({ nullable: true, unique: true })
    sku: string;

    @Column({ nullable: true })
    barcode: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('decimal', { name: 'cost_price', precision: 10, scale: 2, nullable: true })
    costPrice: number;

    @Column({ name: 'stock_quantity', default: 0 })
    stockQuantity: number;

    @Column({ name: 'min_stock', default: 0 })
    minStock: number;

    @Column({ name: 'image_url', nullable: true })
    imageUrl: string;

    @Column({ name: 'woocommerce_id', nullable: true })
    woocommerceId: string;

    @Column({ name: 'bling_id', nullable: true })
    blingId: string;

    @Column({ name: 'sync_woocommerce', default: false })
    syncWooCommerce: boolean;

    @Column({ name: 'sync_bling', default: false })
    syncBling: boolean;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
