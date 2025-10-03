import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { GatewayModule } from './gateway/gateway.module.js';
import { KafkaModule } from './kafka/kafka.module.js';

@Module({
  imports: [GatewayModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
