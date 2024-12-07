import { Module } from '@nestjs/common';
import { See360PaymentsService } from './see-360-payments.service';
import { See360PaymentsController } from './see-360-payments.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { See360Payment, See360PaymentSchema } from './entities/see-360-payment.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: See360Payment.name, schema: See360PaymentSchema }],
      'See360'),
    HttpModule
  ],
  controllers: [See360PaymentsController],
  providers: [See360PaymentsService],
})
export class See360PaymentsModule {}
