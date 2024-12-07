export class CreatePaymentDto {
  paymentId: string;

  user: string;

  amount: number;

  currency: string;

  status: string;

  method: string;
}
