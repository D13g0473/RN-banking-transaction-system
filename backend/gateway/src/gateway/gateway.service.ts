import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { KafkaService } from '../kafka/kafka.service.js';
import { WebsocketGateway } from './websocket.gateway.js';

@Injectable()
export class GatewayService {
  private subscriptions: Map<string, Socket[]> = new Map();

  constructor(
    private kafkaService: KafkaService,
    private websocketGateway: WebsocketGateway,
  ) {}

  subscribe(client: Socket, data: { userId?: string; transactionId?: string }) {
    if (data.transactionId) {
      if (!this.subscriptions.has(data.transactionId)) {
        this.subscriptions.set(data.transactionId, []);
      }
      this.subscriptions.get(data.transactionId)!.push(client);
      console.log(`Client ${client.id} subscribed to transaction ${data.transactionId}`);
    }
  }

  async broadcastEvent(event: any) {
    const { transactionId } = event;
    const clients = this.subscriptions.get(transactionId);
    if (clients && clients.length > 0) {
      console.log(`Broadcasting event to ${clients.length} clients for transaction ${transactionId}`);
      clients.forEach(client => {
        client.emit('transactionEvent', event);
      });
    } else {
      console.log(`No clients subscribed to transaction ${transactionId}`);
    }
  }
}