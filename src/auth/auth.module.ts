import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    //Configuracion JWT 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    //Configuracion JWT Asincrono 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        /*
        (cómo se gestionan y acceden a las variables de configuración en una aplicación)
        console.log('JWT', configService.get('JWT_SECRET'))
        console.log('jwt', process.env.JWT_SECRET)
        */
        return {
          secret: configService.get('JWT_SECRET'),
          singOptions: {
            expiresIn: '2h'
          }
        }
      }
    })

    //Configuracion JWT Sincrono

    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   singOptions: {
    //     expiresIn:'2h'
    //   }
    // })
  ],
  exports: [
    TypeOrmModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
