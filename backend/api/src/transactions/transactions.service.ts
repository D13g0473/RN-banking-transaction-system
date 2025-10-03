import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { KafkaService } from '../kafka/kafka.service.js';
import { TransactionInitiated } from '../events.js';

@Injectable()
export class TransactionsService {
  constructor(private kafkaService: KafkaService) {}

  async initiateTransaction(data: {
    fromAccount: string;
    toAccount: string;
    amount: number;
    currency: string;
    userId: string;
  }) {
    const transactionId = uuidv4();
    const event: TransactionInitiated = {
      transactionId,
      ...data,
      timestamp: new Date(),
    };
    await this.kafkaService.sendMessage('txn.commands', event, transactionId);
    return { transactionId };
  }
}
