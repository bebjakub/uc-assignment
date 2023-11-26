import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EEnvKey } from '@/modules/appConfig/enum/EEnvKey';
import { AppConfigService } from '@/modules/appConfig/service/appConfig.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object<Record<EEnvKey, Joi.Schema>>({
        [EEnvKey.API_PORT]: Joi.number().integer().positive().required(),
        [EEnvKey.DATABASE_HOST]: Joi.string().required(),
        [EEnvKey.DATABASE_PORT]: Joi.number().integer().positive().required(),
        [EEnvKey.DATABASE_USER]: Joi.string().required(),
        [EEnvKey.DATABASE_PASSWORD]: Joi.string().required(),
        [EEnvKey.DATABASE_NAME]: Joi.string().required(),
        [EEnvKey.RATES_API_KEY]: Joi.string().required(),
      }),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
