import { Injectable, Logger } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service.js';
import {
  TransactionInitiated,
  FundsReserved,
  FraudChecked,
  Committed,
  Reversed,
  Notified,
} from '../events.js';

@Injectable()
export class SagaService {
  private readonly logger = new Logger(SagaService.name);

  constructor(private kafkaService: KafkaService) {}

  async processTransaction(event: TransactionInitiated) {
    const { transactionId } = event;
    this.logger.log(`Processing transaction: ${transactionId}`);

    try {
      // Step 1: Reserve Funds
      const fundsReserved: FundsReserved = {
        transactionId,
        ok: true,
        holdId: 'hold-' + transactionId,
        amount: event.amount,
        timestamp: new Date(),
      };
      this.logger.log(`Sending FundsReserved event for transaction: ${transactionId}`);
      await this.kafkaService.sendMessage('txn.events', fundsReserved, transactionId);

      // Step 2: Fraud Check (simulate random)
      const risk = Math.random() > 0.8 ? 'HIGH' : 'LOW';
      this.logger.log(`Fraud check result for transaction ${transactionId}: ${risk}`);
      const fraudChecked: FraudChecked = {
        transactionId,
        risk,
        timestamp: new Date(),
      };
      this.logger.log(`Sending FraudChecked event for transaction: ${transactionId}`);
      await this.kafkaService.sendMessage('txn.events', fraudChecked, transactionId);

      if (risk === 'HIGH') {
        // Reverse
        this.logger.log(`Reversing transaction ${transactionId} due to high fraud risk`);
        const reversed: Reversed = {
          transactionId,
          reason: 'High fraud risk',
          timestamp: new Date(),
        };
        this.logger.log(`Sending Reversed event for transaction: ${transactionId}`);
        await this.kafkaService.sendMessage('txn.events', reversed, transactionId);
        return;
      }

      // Step 3: Commit
      this.logger.log(`Committing transaction: ${transactionId}`);
      const committed: Committed = {
        transactionId,
        ledgerTxId: 'ledger-' + transactionId,
        timestamp: new Date(),
      };
      this.logger.log(`Sending Committed event for transaction: ${transactionId}`);
      await this.kafkaService.sendMessage('txn.events', committed, transactionId);

      // Step 4: Notify
      this.logger.log(`Sending notifications for transaction: ${transactionId}`);
      const notified: Notified = {
        transactionId,
        channels: ['email', 'sms'],
        timestamp: new Date(),
      };
      this.logger.log(`Sending Notified event for transaction: ${transactionId}`);
      await this.kafkaService.sendMessage('txn.events', notified, transactionId);

    } catch (error) {
      // Send to DLQ
      await this.kafkaService.sendMessage('txn.dlq', { transactionId, error: error.message }, transactionId);
    }
  }
}
