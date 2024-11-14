import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt' //Incrptar Password

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
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

      return user

    } catch (error) {

      this.handleDBErrors(error)

    }
  }

  private handleDBErrors(error: any) {

    if (error.code === '23505') {

      throw new BadRequestException(error.detail);

      console.log(error);

      throw new InternalServerErrorException('Please check server logs')

    }
  }
}
