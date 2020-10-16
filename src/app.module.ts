import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoolqModule } from './coolq/coolq.module';

@Module({
  imports: [CoolqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
