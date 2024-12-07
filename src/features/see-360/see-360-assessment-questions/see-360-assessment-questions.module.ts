import { Module } from '@nestjs/common';
import { See360AssessmentQuestionsService } from './see-360-assessment-questions.service';
import { See360AssessmentQuestionsController } from './see-360-assessment-questions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { See360AssessmentQuestions, See360AssessmentQuestionsSchema } from './entities/see-360-assessment-question.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: See360AssessmentQuestions.name, schema: See360AssessmentQuestionsSchema }],
      'See360'),
  ],
  controllers: [See360AssessmentQuestionsController],
  providers: [See360AssessmentQuestionsService],
})
export class See360AssessmentQuestionsModule {}
