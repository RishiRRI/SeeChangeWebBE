import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  fcmToken: string;

  @Prop({ required: true, default: false })
  isSuperAdmin: boolean;

  @Prop()
  sessionToken: string;

  @Prop({ required: true, default: "paymentDone" })
  userStatus: string;

  @Prop({ type: [String], default: [] })
  pdfAccess: string[];

  @Prop({ required: true, default: "newUser" })
  feedbackStatus: string;

  @Prop()
  feedback: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

// @Prop()
// apps: string[];

// @Prop()
// userType: string[];