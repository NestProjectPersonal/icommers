import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt' //Incrptar Password

import { LoginUserDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService:JwtService
  ) { }


  async create(CreateUserDto: CreateUserDto) {

    try {

      const { password, ...userData } = CreateUserDto; // traer contraseña (desestructurarDTO)

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)// incriptar en una sola via(data que se va a incriptar(password,#devueltas))
      });

      await this.userRepository.save(user)
      delete user.password

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }
  

    } catch (error) {

      this.handleDBErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id:true }// campos deseados para mostrar
    })

    if (!user)
      throw new UnauthorizedException('Credentials are not valid(email)') // se lanza cuando un usuario no está autorizado para solicitar un recurso
    if (!bcrypt.compareSync(password, user.password))// comparamos la data ingresada con la de la DB
      throw new UnauthorizedException('Credentials are not valid(password)')

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }

  }

  /*
   JWT: se utiliza para autenticar a usuarios, permitiendo que solo usuarios autenticados puedan realizar ciertas
  acciones(yarn add -D @types/passport-jwt, @nestjs/jwt passport - jwt, @nestjs / passport passport)
  */


  //metodo de crear JWT

  private getJwtToken( payload: JwtPayload){
    //jwtService hace parte de la libreria
    const token = this.jwtService.sign( payload );
    return token
  }


  private handleDBErrors(error: any) {

    if (error.code === '23505') {

      throw new BadRequestException(error.detail);

      console.log(error);

      throw new InternalServerErrorException('Please check server logs')

    }
  }
}
