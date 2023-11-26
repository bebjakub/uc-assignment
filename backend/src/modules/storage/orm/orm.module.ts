import { AppConfigModule } from '@/modules/appConfig/appConfig.module';
import { AppConfigService } from '@/modules/appConfig/service/appConfig.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AppConfigModule,
    // https://github.com/ipenywis/react-nestjs-full-web-app/blob/master/nestjs-cars-app/ormconfig.json
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        type: 'mysql',
        host: appConfigService.getDatabaseHost(),
        port: appConfigService.getDatabasePort(),
        username: appConfigService.getDatabaseUser(),
        password: appConfigService.getDatabasePassword(),
        database: appConfigService.getDatabaseName(),
        autoLoadEntities: true,
        synchronize: true,
        // logging: true,
      }),
    }),
  ],
})
export class OrmModule {}
