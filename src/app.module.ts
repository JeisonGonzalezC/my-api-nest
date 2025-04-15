import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncService } from './sync/sync.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ProductsModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, SyncService],
})
export class AppModule {}
