import { Controller, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service.js';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() body: {
    fromAccount: string;
    toAccount: string;
    amount: number;
    currency: string;
    userId: string;
  }) {
    return this.transactionsService.initiateTransaction(body);
  }
}
