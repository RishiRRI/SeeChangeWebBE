// assessment-response.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { See360User } from 'src/features/see-360/see-360-user/entities/see-360-user.entity';
import { See360AssessmentQuestions } from 'src/features/see-360/see-360-assessment-questions/entities/see-360-assessment-question.entity';

@Schema({ timestamps: true })
export class See360AssessmentRecord extends Document {
  @Prop({ type: Types.ObjectId, ref: 'See360User', required: true })
  user: See360User;

  @Prop([
    {
      category: String,
      question: {
        type: Types.ObjectId,
        ref: 'See360AssessmentQuestions',
        required: true,
      },
      questionName: String,

      options: [
        {
            _id: { type: Types.ObjectId },
          option: { type: String, required: true },
          value: { type: String },
          marks: { type: Number },
        },
      ],
      answered: [
        {
          _id: { type: Types.ObjectId },
          option: { type: String },
          value: { type: String },
          marks: { type: Number },
        },
      ],
    },
  ])
  responses: Array<{
    question: Types.ObjectId;
    category: string;
    questionName: string;
    answered: { _id: Types.ObjectId; option: string; value: string; marks: number };
    options: Array<{ _id: Types.ObjectId; option: string; value: string; marks: number }>;
  }>;
}

export const See360AssessmentRecordSchema = SchemaFactory.createForClass(
  See360AssessmentRecord,
);
