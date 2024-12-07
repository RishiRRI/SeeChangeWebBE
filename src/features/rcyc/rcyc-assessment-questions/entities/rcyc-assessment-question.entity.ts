// question.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({
    timestamps: true,
  })
export class RcycAssessmentQuestions extends Document {
  @Prop({ required: true })
  mainQuestion: string;

  @Prop([{
    option: { type: String, required: true },
    value: { type: String, required: true },
    rating: { type: Number, min: 1, max: 4 }
  }])
  options: Array<{ option: string; value: string; rating: number }>;
}

export const RcycAssessmentQuestionsSchema = SchemaFactory.createForClass(RcycAssessmentQuestions);
