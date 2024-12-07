import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { See360Payment } from './entities/see-360-payment.entity';

@Injectable()
export class See360PaymentsService {
  constructor(
    @InjectModel(See360Payment.name, 'See360')
    private see360PaymentModel: mongoose.Model<See360Payment>,
  ) {}

  async create(paymentData: Partial<See360Payment>): Promise<See360Payment> {
    const payment = new this.see360PaymentModel(paymentData);
    // console.log(paymentData);
    // console.log('Saving payment details:');
    return payment.save();
  }

  async getPaymentList(): Promise<See360Payment[]> {
    return this.see360PaymentModel.find().sort({ createdAt: -1 });
  }
}
