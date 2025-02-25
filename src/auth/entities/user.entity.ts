import { Product } from "src/products/entities";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
 

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        unique: true
    }) 
    email:string;
    
    @Column('text',{
        select:false
    })
    password: string;
    
    @Column('text')
    fullName: string;
    
    @Column('bool',{
        default: true
    }) //postgres bool
    isActive: boolean;
    
    @Column('text',{
        array:true,
        default:['user']
    })
    roles: string[];

@OneToMany(
    ()=> Product,
    (product) =>product.user
)
product: Product;


}
