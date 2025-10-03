import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);
  private consumer: Consumer;
  private eventCallback: ((event: any) => void) | null = null;

  constructor() {
    const kafka = new Kafka({
      clientId: 'gateway-service',
      brokers: [process.env.KAFKA_BROKERS || 'kafka:9092'],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
    this.consumer = kafka.consumer({
      groupId: 'gateway-group',
      allowAutoTopicCreation: false,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      maxWaitTimeInMs: 100,
    });
  }

  async onModuleInit() {
    await this.consumer.connect();
  }

  setEventCallback(callback: (event: any) => void) {
    this.eventCallback = callback;
    // Subscribe to events after callback is set
    this.subscribeToEvents();
  }

  async subscribeToEvents() {
    this.logger.log('Subscribing to txn.events topic');
    await this.consumer.subscribe({ topic: 'txn.events' });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const value = JSON.parse(message.value.toString());
          this.logger.log(`Message received: ${JSON.stringify(value)}`);
          this.logger.log(`Event callback exists: ${!!this.eventCallback}`);
          if (this.eventCallback) {
            this.logger.log('Calling event callback');
            this.eventCallback(value);
          } else {
            this.logger.warn('No event callback set');
          }
        } else {
          this.logger.warn('Received message with null value');
        }
      },
    });
  }
}
