import { Module } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service.js';
import { KafkaModule } from '../kafka/kafka.module.js';
import { SagaModule } from '../saga/saga.module.js';

@Module({
  providers: [OrchestratorService],
  imports: [KafkaModule, SagaModule]
})
export class OrchestratorModule {}
