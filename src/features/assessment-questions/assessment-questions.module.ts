import { Module } from '@nestjs/common';
import { AssessmentQuestionsService } from './assessment-questions.service';
import { AssessmentQuestionsController } from './assessment-questions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AssessmentQuestions, AssessmentQuestionsSchema } from './entities/assessment-question.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: AssessmentQuestions.name, schema: AssessmentQuestionsSchema }],
      'See_Change_Web'),
  ],
  controllers: [AssessmentQuestionsController],
  providers: [AssessmentQuestionsService],
})
export class AssessmentQuestionsModule {}
