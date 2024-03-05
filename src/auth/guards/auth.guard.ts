import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtLoginPayload } from 'common/interfaces/jwtLoginPayload';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { CustomRequest } from 'common/interfaces/customRequest';
import { ResponseMessage } from 'common/constants/response/message';
import { StatusCode } from 'common/constants/response/statusCode';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req: CustomRequest = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromRequest(req);
    if (!token)
      throw new HttpException(
        ResponseMessage.UNAUTHORIZED,
        StatusCode.SESSION_TIMEOUT,
      );

    try {
      const payload = this.jwtService.verify<JwtLoginPayload>(token);
      console.log(payload);
      //find details from user repository and add in user object of req of custom request
      //req['user'] = details
    } catch (error) {
      throw new HttpException(
        ResponseMessage.UNAUTHORIZED,
        StatusCode.SESSION_TIMEOUT,
      );
    }
    return true;
  }

  extractTokenFromRequest(req: CustomRequest): string | undefined {
    const [type, token] = req.get('Authorization')?.split(' ') ?? [];
    return type?.toLowerCase() === 'bearer' ? token : undefined;
  }
}
