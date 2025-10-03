import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private producer: Producer;
  private consumer: Consumer;
  private readonly logger = new Logger(KafkaService.name);

  constructor() {
    const kafka = new Kafka({
      clientId: 'orchestrator-service',
      brokers: [process.env.KAFKA_BROKERS || 'kafka:9092'],
      retry: {
        initialRetryTime: 300,
        retries: 10,
      },
    });
    this.producer = kafka.producer({ allowAutoTopicCreation: false });
    this.consumer = kafka.consumer({
      groupId: 'orchestrator-group',
      allowAutoTopicCreation: false,
    });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async sendMessage(topic: string, message: any, key?: string) {
    await this.producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(message) }],
    });
  }

  async subscribe(topic: string, callback: (message: any) => void) {
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        this.logger.log(`Message received: ${message.value?.toString() ?? 'null'}`);
        if (message.value) {
          const value = JSON.parse(message.value.toString());
          await callback(value);
        }
      },
    });
  }
}
