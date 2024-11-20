import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RcycPayment } from './entities/rcyc-payment.entity';

@Injectable()
export class RcycPaymentsService {
  constructor(
    @InjectModel(RcycPayment.name, 'Rcyc')
    private rcycPaymentModel: mongoose.Model<RcycPayment>,
  ) {}

  async create(paymentData: Partial<RcycPayment>): Promise<RcycPayment> {
    const payment = new this.rcycPaymentModel(paymentData);
    // console.log(paymentData);
    // console.log('Saving payment details:');
    return payment.save();
  }

  async getPaymentList(): Promise<RcycPayment[]> {
    return this.rcycPaymentModel.find().sort({ createdAt: -1 });
  }
}
