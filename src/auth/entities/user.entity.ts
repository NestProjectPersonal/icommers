import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
 

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        unique: true
    }) 
    email:string;
    
    @Column('text')
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

}
