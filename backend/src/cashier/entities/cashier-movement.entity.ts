import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Cashier } from './cashier.entity';
import { User } from '../../users/entities/user.entity';

@Entity('cashier_movements')
export class CashierMovement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Cashier)
    @JoinColumn({ name: 'cashier_id' })
    cashier: Cashier;

    @Column()
    type: string; // reinforcement, withdrawal, expense

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    reason: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
