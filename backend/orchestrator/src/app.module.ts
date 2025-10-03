import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { OrchestratorModule } from './orchestrator/orchestrator.module.js';
import { KafkaModule } from './kafka/kafka.module.js';
import { SagaModule } from './saga/saga.module.js';

@Module({
  imports: [OrchestratorModule, KafkaModule, SagaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
