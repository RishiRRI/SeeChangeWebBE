import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name, 'MrRight')
    private paymentModel: mongoose.Model<Payment>,
  ) {}

  async create(paymentData: Partial<Payment>): Promise<Payment> {
    const payment = new this.paymentModel(paymentData);
    // console.log(paymentData);
    // console.log('Saving payment details:');
    return payment.save();
  }

  async getPaymentList(): Promise<Payment[]> {
    return this.paymentModel.find().sort({ createdAt: -1 });
  }
}
