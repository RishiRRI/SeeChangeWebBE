import { PartialType } from '@nestjs/mapped-types';
import { CreateRcycPaymentDto } from './create-rcyc-payment.dto';

export class UpdateRcycPaymentDto extends PartialType(CreateRcycPaymentDto) {}
