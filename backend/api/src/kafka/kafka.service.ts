import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService {
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'api-service',
      brokers: [process.env.KAFKA_BROKERS || 'localhost:9093'],
    });
    this.producer = kafka.producer();
    this.producer.connect();
  }

  async sendMessage(topic: string, message: any, key?: string) {
    await this.producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(message) }],
    });
  }
}
