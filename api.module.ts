import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { AppLoggerMiddleware } from './api.logger.middleware';
import {
  AuthModule,
  RmqModule,
  TENANCY_SERVICE,
  ADAPTER_SERVICE,
  NSHIFT_SERVICE,
  CommonTenancyModule,
  //ServicesModule,
  dataSourceOptions as globalDataSourceOptions,
  ServicesService,
  ShippersService,
  ServiceEntity,
  AddressEntity,
  ShipperEntity,
  PaymentTermsService,
  PaymentTermsEntity,
  IncotermsService,
  IncotermsEntity,
  ShipmentEntity,
  ShipunitEntity,
  ShipmentsModule,
  ShipmentsService,
  ShipunitsModule,
} from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ShipunitsService } from '@app/common/modules/shipunits/shipunits.service';

//import { CarrierServiceMappingsModule } from './modules/carrier-service-mappings/carrier-service-mappings.module';

const configService = new ConfigService();
const logger = new Logger('ApiModule');
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: `./apps/api/.env.development` });
}

const dataSourceOptions = {
  ...globalDataSourceOptions,
  host: configService.get<string>('POSTGRES_HOST'),
  port: configService.get<number>('POSTGRES_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  logging: configService.get<string>('DB_LOGGING'),
  entities: [
    ShipperEntity,
    AddressEntity,
    ServiceEntity,
    PaymentTermsEntity,
    IncotermsEntity,
    ShipmentEntity,
    ShipunitEntity,
  ],
} as DataSourceOptions;

// logger.log('datasource options' + JSON.stringify(dataSourceOptions));

@Module({
  imports: [
    ShipmentsModule,
    ShipunitsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_LOGGING: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_ADAPTER_QUEUE: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_TENANCY_QUEUE: Joi.string().required(),
        RABBIT_MQ_NSHIFT_QUEUE: Joi.string().required(),
        PORT: Joi.number().required(),
        API_LOGGING: Joi.string().required(),
      }),
    }),
    RmqModule.register({ name: ADAPTER_SERVICE }),
    RmqModule.register({ name: TENANCY_SERVICE }),
    RmqModule.register({ name: TENANCY_SERVICE }),
    RmqModule.register({ name: NSHIFT_SERVICE }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    CommonTenancyModule,
  ],
  controllers: [ApiController],
  providers: [ApiService, ServicesService, ShippersService, PaymentTermsService, ShipmentsService, ShipunitsService],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
