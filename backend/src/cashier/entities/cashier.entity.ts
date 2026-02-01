import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('cashiers')
export class Cashier {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'opened_at' })
    openedAt: Date;

    @Column({ name: 'closed_at', nullable: true })
    closedAt: Date;

    @Column('decimal', { name: 'opening_balance', precision: 10, scale: 2, default: 0 })
    openingBalance: number;

    @Column('decimal', { name: 'closing_balance', precision: 10, scale: 2, nullable: true })
    closingBalance: number;

    @Column('decimal', { name: 'expected_balance', precision: 10, scale: 2, nullable: true })
    expectedBalance: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    difference: number;

    @Column({ default: 'open' })
    status: string; // open, closed

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
