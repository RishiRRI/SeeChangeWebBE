import { Module } from '@nestjs/common';
import { RcycAssessmentQuestionsService } from './rcyc-assessment-questions.service';
import { RcycAssessmentQuestionsController } from './rcyc-assessment-questions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RcycAssessmentQuestions, RcycAssessmentQuestionsSchema } from './entities/rcyc-assessment-question.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: RcycAssessmentQuestions.name, schema: RcycAssessmentQuestionsSchema }],
      'Rcyc'),
  ],
  controllers: [RcycAssessmentQuestionsController],
  providers: [RcycAssessmentQuestionsService],
})
export class RcycAssessmentQuestionsModule {}
