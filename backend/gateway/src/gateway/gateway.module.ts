import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway.js';
import { GatewayService } from './gateway.service.js';
import { KafkaModule } from '../kafka/kafka.module.js';

@Module({
  providers: [WebsocketGateway, GatewayService],
  imports: [KafkaModule],
  exports: [WebsocketGateway, GatewayService]
})
export class GatewayModule {}
