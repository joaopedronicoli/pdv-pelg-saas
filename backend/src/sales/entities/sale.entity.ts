import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { Cashier } from '../../cashier/entities/cashier.entity';
import { User } from '../../users/entities/user.entity';
import { SaleItem } from './sale-item.entity';
import { Payment } from './payment.entity';

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'sale_number', unique: true })
    saleNumber: string;

    @ManyToOne(() => Customer, { nullable: true })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @ManyToOne(() => Cashier, { nullable: true })
    @JoinColumn({ name: 'cashier_id' })
    cashier: Cashier;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discount: number;

    @Column({ name: 'discount_type', nullable: true })
    discountType: string;

    @Column({ name: 'coupon_code', nullable: true })
    couponCode: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column({ default: 'completed' })
    status: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ name: 'woocommerce_order_id', nullable: true })
    woocommerceOrderId: string;

    @Column({ name: 'bling_order_id', nullable: true })
    blingOrderId: string;

    @Column({ name: 'invoice_number', nullable: true })
    invoiceNumber: string;

    @Column({ name: 'invoice_url', nullable: true })
    invoiceUrl: string;

    @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
    items: SaleItem[];

    @OneToMany(() => Payment, (payment) => payment.sale, { cascade: true })
    payments: Payment[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
    cancelledAt: Date;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'cancelled_by' })
    cancelledBy: User;
}
