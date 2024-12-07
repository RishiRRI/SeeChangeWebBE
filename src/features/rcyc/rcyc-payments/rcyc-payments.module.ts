import { Module } from '@nestjs/common';
import { RcycPaymentsService } from './rcyc-payments.service';
import { RcycPaymentsController } from './rcyc-payments.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { RcycPayment, RcycPaymentSchema } from './entities/rcyc-payment.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: RcycPayment.name, schema: RcycPaymentSchema }],
      'Rcyc'),
    HttpModule
  ],
  controllers: [RcycPaymentsController],
  providers: [RcycPaymentsService],
})
export class RcycPaymentsModule {}
