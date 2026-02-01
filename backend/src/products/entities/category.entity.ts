import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    type: string; // product, service

    @ManyToOne(() => Category, (category) => category.children, { nullable: true })
    @JoinColumn({ name: 'parent_id' })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @Column({ name: 'woocommerce_id', nullable: true })
    woocommerceId: string;

    @Column({ name: 'bling_id', nullable: true })
    blingId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
