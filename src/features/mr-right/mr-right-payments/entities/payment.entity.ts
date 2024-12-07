import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Payment extends Document {
    @Prop({ required: true })
    paymentId: string;

    @Prop({ required: true })
    user: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    currency: string;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    method: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
