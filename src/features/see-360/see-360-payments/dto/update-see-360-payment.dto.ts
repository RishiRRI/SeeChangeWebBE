import { PartialType } from '@nestjs/mapped-types';
import { CreateSee360PaymentDto } from './create-see-360-payment.dto';

export class UpdateSee360PaymentDto extends PartialType(CreateSee360PaymentDto) {}
