import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import Razorpay from 'razorpay';
import { RcycPaymentsService } from './rcyc-payments.service'; 
import { RcycPayment } from './entities/rcyc-payment.entity';

@Controller('rcycPayments')
export class RcycPaymentsController {
  private razorpay: Razorpay;

  constructor(private readonly rcycPaymentsService: RcycPaymentsService) {
    this.razorpay = new Razorpay({
      key_id: 'rzp_test_u85r2jwM23xKlY',
      key_secret: '0q84vUiUDgL7ikOtM6q8mj8i',
    });
  }

  @Post('orders')
  async createOrder(
    @Body() body: { amount: number; currency: string },
    @Res() res: Response,
  ) {
    const options = {
      amount: body.amount,
      currency: body.currency,
      receipt: 'receipt#1',
      payment_capture: 1,
    };

    try {
      const response = await this.razorpay.orders.create(options);
      res.json({
        order_id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal server error');
    }
  }

  @Post('savePayment')
  async savePayment(@Body() paymentData) {
    return this.rcycPaymentsService.create(paymentData);
  }

  @Get('/getPaymentList')
  async findAll(): Promise<RcycPayment[]> {
    return this.rcycPaymentsService.getPaymentList();
  }

  @Get('payment/:paymentId/:userId')
  async getPayment(
    @Param('paymentId') paymentId: string,
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);

      if (!payment) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json('Error at Razorpay loading');
      }

      const amount =
        typeof payment.amount === 'string'
          ? parseFloat(payment.amount)
          : payment.amount;

      const paymentData = {
        paymentId: payment.id,
        user: userId, // Include the user ID here
        amount: amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
      };

    //   console.log('Saving payment data:', paymentData);

      await this.rcycPaymentsService.create(paymentData);

      res.json({
        paymentId: payment.id,
        status: payment.status,
        method: payment.method,
        amount: amount,
        currency: payment.currency,
      });
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('Failed to fetch');
    }
  }
}