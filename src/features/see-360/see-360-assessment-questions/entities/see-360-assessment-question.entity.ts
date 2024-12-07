// question.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class See360AssessmentQuestions extends Document {
  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  mainQuestion: string;

  @Prop([
    {
      _id: { type: Types.ObjectId }, 
      option: { type: String, required: true },
      value: { type: String },
      marks: { type: Number },
    },
  ])
  options: Array<{ _id: Types.ObjectId; option: string; value: string; marks: number }>;
}

export const See360AssessmentQuestionsSchema = SchemaFactory.createForClass(
  See360AssessmentQuestions,
);
