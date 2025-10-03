import { io, Socket } from 'socket.io-client';
import { TransactionEvent } from '../types/events';
import { WS_BASE_URL } from './config';

class WebSocketService {
  private socket: Socket | null = null;
  private eventListeners: ((event: TransactionEvent) => void)[] = [];

  connect(transactionId: string) {
    console.log('Connecting to WS:', WS_BASE_URL);
    this.socket = io(WS_BASE_URL);
    this.socket.on('connect', () => {
      console.log('Connected to WS');
      console.log('Subscribing to transaction:', transactionId);
      this.socket?.emit('subscribe', { transactionId });
    });
    this.socket.on('disconnect', () => {
      console.log('Disconnected from WS');
    });
    this.socket.on('connect_error', (error) => {
      console.log('WS connection error:', error);
    });
    this.socket.on('transactionEvent', (event: TransactionEvent) => {
      console.log('Received WS event:', event);
      this.eventListeners.forEach(listener => listener(event));
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  onEvent(listener: (event: TransactionEvent) => void) {
    this.eventListeners.push(listener);
  }

  offEvent(listener: (event: TransactionEvent) => void) {
    this.eventListeners = this.eventListeners.filter(l => l !== listener);
  }
}

export const websocketService = new WebSocketService();