import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    CASHIER = 'cashier',
    STOCKIST = 'stockist',
    ATTENDANT = 'attendant',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password?: string; // Nullable for external auth if needed, but usually required

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CASHIER,
    })
    role: UserRole;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
