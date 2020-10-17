import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CoolqModule } from './coolq/coolq.module';

@Module({
  imports: [CoolqModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
