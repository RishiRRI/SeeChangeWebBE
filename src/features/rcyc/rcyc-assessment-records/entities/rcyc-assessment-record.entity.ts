// assessment-response.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RcycUser } from 'src/features/rcyc/rcyc-user/entities/rcyc-user.entity';
import { RcycAssessmentQuestions } from 'src/features/rcyc/rcyc-assessment-questions/entities/rcyc-assessment-question.entity';

@Schema({ timestamps: true })
export class RcycAssessmentRecord extends Document {
  @Prop({ type: Types.ObjectId, ref: 'RcycUser', required: true })
  user: RcycUser;

  @Prop([
    {
      question: {
        type: Types.ObjectId,
        ref: 'RcycAssessmentQuestions',
        required: true,
      },
      questionName: String,

      ratings: [
        {
          option: { type: String, required: true },
          value: { type: String, required: true },
          rating: { type: Number, min: 1, max: 4, required: true },
        },
      ],
    },
  ])
  responses: Array<{
    question: Types.ObjectId;
    ratings: Array<{ option: string; value: string; rating: number }>;
  }>;
}

export const RcycAssessmentRecordSchema =
  SchemaFactory.createForClass(RcycAssessmentRecord);
