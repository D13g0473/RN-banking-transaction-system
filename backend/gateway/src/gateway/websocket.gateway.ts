import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { KafkaService } from '../kafka/kafka.service.js';

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private subscriptions: Map<string, Socket[]> = new Map();
  private eventHistory: Map<string, any[]> = new Map();

  constructor(private kafkaService: KafkaService) {}

  async onModuleInit() {
    // Set up event callback for Kafka messages
    this.kafkaService.setEventCallback((event: any) => {
      this.broadcastEvent(event);
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove client from all subscriptions
    for (const [transactionId, clients] of this.subscriptions.entries()) {
      const index = clients.indexOf(client);
      if (index > -1) {
        clients.splice(index, 1);
        if (clients.length === 0) {
          this.subscriptions.delete(transactionId);
          // Clear event history when no clients are subscribed
          this.eventHistory.delete(transactionId);
          console.log(`Cleared event history for transaction ${transactionId}`);
        }
      }
    }
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @MessageBody() data: { userId?: string; transactionId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (data.transactionId) {
      if (!this.subscriptions.has(data.transactionId)) {
        this.subscriptions.set(data.transactionId, []);
      }
      this.subscriptions.get(data.transactionId)!.push(client);
      console.log(`Client ${client.id} subscribed to transaction ${data.transactionId}`);

      // Send event history to the newly subscribed client
      const history = this.eventHistory.get(data.transactionId);
      if (history && history.length > 0) {
        console.log(`Sending ${history.length} historical events to client ${client.id}`);
        history.forEach(event => {
          client.emit('transactionEvent', event);
        });
      }
    }
  }

  broadcastEvent(event: any) {
    const { transactionId } = event;
    console.log(`Broadcasting event for transaction ${transactionId}:`, event);

    // Store event in history
    if (!this.eventHistory.has(transactionId)) {
      this.eventHistory.set(transactionId, []);
    }
    this.eventHistory.get(transactionId)!.push(event);

    // Keep only last 10 events per transaction to avoid memory issues
    const history = this.eventHistory.get(transactionId)!;
    if (history.length > 10) {
      history.shift();
    }

    const clients = this.subscriptions.get(transactionId);
    console.log(`Found ${clients?.length || 0} clients subscribed to transaction ${transactionId}`);
    if (clients && clients.length > 0) {
      clients.forEach(client => {
        client.emit('transactionEvent', event);
      });
      console.log(`Broadcasted event to ${clients.length} clients for transaction ${transactionId}`);
    } else {
      console.log(`No clients subscribed to transaction ${transactionId}, event stored in history`);
    }
  }
}