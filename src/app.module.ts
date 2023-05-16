import { Module } from '@nestjs/common';
import { ConvertModule } from './modules/convert/convert.module';

@Module({
  imports: [ConvertModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
