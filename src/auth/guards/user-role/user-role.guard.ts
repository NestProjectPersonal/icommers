import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

//Guard entra al ciclo de vida de nest, se encargara de evaluar el usuario(roles)
@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(

    private readonly reflector: Reflector
  ) { }

  //regresa booleano (true-false)  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler()) //=> metodo de roles  

    if( ! validRoles ) return true
    if( validRoles.length === 0 ) return true

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user)
      throw new BadRequestException('User no found')
    //console.log({userRoles: user.roles})
    for (const role of user.roles) { //=> valida todos los roles del usuario
      if (validRoles.includes(role)) { //=> validacion del metodo 
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role: [${validRoles}]`
    )
  }
}
