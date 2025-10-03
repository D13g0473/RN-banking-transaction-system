import { Module } from '@nestjs/common';
import { SagaService } from './saga.service.js';
import { KafkaModule } from '../kafka/kafka.module.js';

@Module({
  providers: [SagaService],
  imports: [KafkaModule],
  exports: [SagaService]
})
export class SagaModule {}
