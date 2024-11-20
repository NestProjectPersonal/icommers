import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { PassportStrategy } from "@nestjs/passport";
import { Repository } from "typeorm";

import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { User } from "../entities/user.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    /*
    La clase revisa el JWT junto con la variable de entorno(Secret) y junto con el tiempo de expiracion, 
    para cual se determina la strategia para saber si el token es valido
    */

    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,
        private configService: ConfigService
    ){
        super({
            secretOrKey:configService.get('JWT_SECRET'),
            
            //POSICION TOQUEN ( BEARER TOKEN)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            
        });
        
        
    }
    //Metodo se llama si el JWT NO ha inspirado y si la firma del JWT hace match con el payload
    async validate( payload: JwtPayload):Promise<User>{
        
        
        const { id } = payload
        //consultar BD
        const user = await this.userRepository.findOneBy({ id })

        if(!user)
            throw new UnauthorizedException('Token not Valid')
        
        if(!user.isActive)
            throw new UnauthorizedException('User is inactive, talk with an admi')

        return user;
    }



}