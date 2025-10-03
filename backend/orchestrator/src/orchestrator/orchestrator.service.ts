import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service.js';
import { SagaService } from '../saga/saga.service.js';
import { TransactionInitiated } from '../events.js';

@Injectable()
export class OrchestratorService implements OnModuleInit {
  constructor(
    private kafkaService: KafkaService,
    private sagaService: SagaService,
  ) {}

  async onModuleInit() {
    await this.kafkaService.subscribe('txn.commands', async (message: TransactionInitiated) => {
      await this.sagaService.processTransaction(message);
    });
  }
}
