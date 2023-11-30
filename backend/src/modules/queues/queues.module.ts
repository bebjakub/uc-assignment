import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'keydb',
        port: 6379,
      },
    }),
  ],
})
export class QueuesModule {}
