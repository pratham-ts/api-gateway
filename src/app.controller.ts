import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateSoundStageDto } from 'common/proto/soundstage/soundstage';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('addSoundStageUser')
  addSoundStageUser(@Body() createSoundStageUserDto: CreateSoundStageDto) {
    console.log('in');
    return this.appService.addSoundStageUser(createSoundStageUserDto);
  }
}
