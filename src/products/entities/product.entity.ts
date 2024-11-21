import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example:'ID product WTGF6-6SDFSDF-234DSF',
        description:'Product ID',
        uniqueItems: true
    })//se puede generar asi vacio, sin embargo, para garantizar una documentacion mas detallada se utilizan decoradores y porpiedades que ayudan a describir
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:'Name title',
        description:'Product title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;
    
    @ApiProperty({
        example:'0',
        description:'Product price',
        uniqueItems: true
    })
    @Column('float', {
        default: 0
    })
    price: number;
    
    @ApiProperty()
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;
    
    @ApiProperty()
    @Column('text', {
        unique: true// crea un indice unico
    })
    slug: string;
    
    @ApiProperty()
    @Column('int', {
        default: 0
    })
    stock: number;
    
    @ApiProperty()
    @Column('text', {
        array: true
    })
    sizes: string[];
    
    @ApiProperty()
    @Column('text')
    gender: string;
    
    
    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = this.slug
        .toLowerCase()
    }
    

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug.toLowerCase()
    }
    
    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    
    tags: string[];


    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {
            cascade: true,
            eager: true
        }
    )
    images?: ProductImage[];

    @ManyToOne(
        ()=> User,
        (user)=> user.product, 
        {eager: true}
    )
    user: User  


}
