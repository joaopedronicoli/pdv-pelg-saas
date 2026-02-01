import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ name: 'cpf_cnpj', nullable: true })
    cpfCnpj: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'date', nullable: true })
    birthdate: Date;

    @Column({ nullable: true })
    gender: string;

    @Column({ type: 'jsonb', nullable: true })
    address: {
        cep: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
    };

    @Column({ type: 'jsonb', name: 'clinical_data', nullable: true })
    clinicalData: any;

    @Column('simple-array', { nullable: true })
    tags: string[];

    @Column({ name: 'woocommerce_id', nullable: true })
    woocommerceId: string;

    @Column({ name: 'bling_id', nullable: true })
    blingId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
