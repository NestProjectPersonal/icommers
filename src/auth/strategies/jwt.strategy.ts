import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){


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
    // La clase revisa el JWT junto con la variable de entorno(Secret) y junto con el tiempo de expiracion, para cual se determina la strategia para saber si el token es valido
    //Metodo se llama si el JWT NO ha inspirado y si la firma del JWT hace match con el payload
    async validate( payload: JwtPayload):Promise<User>{
        
        
        const { email } = payload
        //consultar BD
        const user = await this.userRepository.findOneBy({ email })

        if(!user)
            throw new UnauthorizedException('Token not Valid')
        
        if(!user.isActive)
            throw new UnauthorizedException('User is inactive, talk with an admi')

        return user;
    }



}