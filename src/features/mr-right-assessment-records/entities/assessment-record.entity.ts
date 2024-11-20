// assessment-response.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/features/mr-right-user/entities/user.entity';
import { AssessmentQuestions } from 'src/features/mr-right-assessment-questions/entities/assessment-question.entity';

@Schema({ timestamps: true })
export class AssessmentRecord extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop([
    {
      question: {
        type: Types.ObjectId,
        ref: 'AssessmentQuestions',
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

export const AssessmentRecordSchema =
  SchemaFactory.createForClass(AssessmentRecord);
