import { Module } from '@nestjs/common';
import { OrmModule } from '@/modules/storage/orm/orm.module';
import { AppConfigModule } from '@/modules/appConfig/appConfig.module';
import { ApiModule } from '@/modules/api/api.module';
import { CacheManagerModule } from '@/modules/cache-manager/cache-manager.module';
import { QueuesModule } from '@/modules/queues/queues.module';

@Module({
  imports: [
    AppConfigModule,
    CacheManagerModule,
    QueuesModule,
    OrmModule,
    ApiModule,
  ],
})
export class AppModule {}
