import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { KafkaModule } from './kafka/kafka.module.js';

@Module({
  imports: [TransactionsModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
