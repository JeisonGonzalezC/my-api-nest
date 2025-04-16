import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { ReportModule } from './report/report.module';
import { ContentfulModule } from './contentful/contentful.module';
import { SyncModule } from './sync/sync.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_DATABASE!,
      entities: [Product],
    }),
    ScheduleModule.forRoot(),
    SyncModule,
    ContentfulModule,
    ProductsModule,
    ReportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
