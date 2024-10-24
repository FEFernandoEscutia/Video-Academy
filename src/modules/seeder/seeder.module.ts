import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';

@Module({
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
