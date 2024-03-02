import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateSoundStageDto,
  SOUND_STAGE_SERVICE_NAME,
  SoundStageServiceClient,
} from 'common/proto/soundstage/soundstage';

@Injectable()
export class AppService implements OnModuleInit {
  private soundStageServiceClient: SoundStageServiceClient;
  constructor(@Inject(SOUND_STAGE_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.soundStageServiceClient = this.client.getService(
      SOUND_STAGE_SERVICE_NAME,
    );
  }

  addSoundStageUser(createSoundStageUserDto: CreateSoundStageDto) {
    return this.soundStageServiceClient.createSoundStageUser(
      createSoundStageUserDto,
    );
  }
}
