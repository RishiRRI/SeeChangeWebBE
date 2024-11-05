// question.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({
    timestamps: true,
  })
export class AssessmentQuestions extends Document {
  @Prop({ required: true })
  mainQuestion: string;

  @Prop([{
    option: { type: String, required: true },
    rating: { type: Number, min: 1, max: 4 }
  }])
  options: Array<{ option: string; rating: number }>;
}

export const AssessmentQuestionsSchema = SchemaFactory.createForClass(AssessmentQuestions);
