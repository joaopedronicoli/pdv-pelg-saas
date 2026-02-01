import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Sale } from './sale.entity';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Sale, (sale) => sale.payments)
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

    @Column()
    method: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ default: 1 })
    installments: number;

    @Column({ name: 'card_brand', nullable: true })
    cardBrand: string;

    @Column({ nullable: true })
    nsu: string;

    @Column({ name: 'authorization_code', nullable: true })
    authorizationCode: string;

    @Column({ name: 'pix_code', type: 'text', nullable: true })
    pixCode: string;

    @Column({ default: 'completed' })
    status: string;

    @Column({ name: 'received_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    receivedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
