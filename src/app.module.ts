import { BadRequestException, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from 'dotenv';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SOUND_STAGE_SERVICE_NAME } from 'common/proto/soundstage/soundstage';
import { join } from 'path';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { ResponseInterceptor } from 'common/interceptor/response-handler.interceptor';
import { ResponseMessage } from 'common/constants/response/message';
import { CustomExceptionFilter } from 'common/filters/custom-exception.filter';

config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SOUND_STAGE_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          protoPath: join(
            __dirname,
            '../common/proto/soundstage/soundstage.proto',
          ),
          package: 'soundstage',
          url: `localhost:${process.env.SOUNDSTAGE_SERVICE_PORT_NUMBER}`,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        stopAtFirstError: true,
        whitelist: true,
        exceptionFactory: (errors) => {
          const result = {
            property: errors[0]
              ? errors[0].property
              : ResponseMessage.NOT_FOUND,
            constraint: errors[0]
              ? errors[0].constraints
              : ResponseMessage.NOT_FOUND,
          };
          return new BadRequestException(result);
        },
      }),
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
