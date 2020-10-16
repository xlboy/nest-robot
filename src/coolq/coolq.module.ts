import { Module } from '@nestjs/common';
import { CoolqController } from './coolq.controller';
import { CoolqService } from './coolq.service';

@Module({
  controllers: [CoolqController],
  providers: [CoolqService]
})
export class CoolqModule {}
