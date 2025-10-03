import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller.js';
import { TransactionsService } from './transactions.service.js';

import { KafkaModule } from '../kafka/kafka.module.js';
@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [KafkaModule]
})
export class TransactionsModule {}
