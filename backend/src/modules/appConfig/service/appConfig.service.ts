import { EEnvKey } from '@/modules/appConfig/enum/EEnvKey';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  public constructor(private readonly configService: ConfigService) {}

  public getApiPort(): number {
    return parseInt(this.configService.get(EEnvKey.API_PORT), 10);
  }

  public getDatabaseHost(): string {
    return this.configService.get(EEnvKey.DATABASE_HOST);
  }

  public getDatabasePort(): number {
    return parseInt(this.configService.get(EEnvKey.DATABASE_PORT), 10);
  }

  public getDatabaseUser(): string {
    return this.configService.get(EEnvKey.DATABASE_USER);
  }

  public getDatabasePassword(): string {
    return this.configService.get(EEnvKey.DATABASE_PASSWORD);
  }

  public getDatabaseName(): string {
    return this.configService.get(EEnvKey.DATABASE_NAME);
  }

  public getRatesApiKey(): string {
    return this.configService.get(EEnvKey.RATES_API_KEY);
  }
}
