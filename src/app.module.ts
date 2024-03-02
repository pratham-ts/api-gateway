import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from 'dotenv';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SOUND_STAGE_SERVICE_NAME } from 'common/proto/soundstage/soundstage';
import { join } from 'path';

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
  providers: [AppService],
})
export class AppModule {}
