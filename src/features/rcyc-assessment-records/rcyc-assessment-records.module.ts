import { Module } from '@nestjs/common';
import { RcycAssessmentRecordsService } from './rcyc-assessment-records.service';
import { RcycAssessmentRecordsController } from './rcyc-assessment-records.controller';
import { RcycAssessmentRecord, RcycAssessmentRecordSchema } from './entities/rcyc-assessment-record.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RcycUser, RcycUserSchema } from '../rcyc-user/entities/rcyc-user.entity';
import { RcycAssessmentQuestions, RcycAssessmentQuestionsSchema } from '../rcyc-assessment-questions/entities/rcyc-assessment-question.entity';
import { RcycUserService } from '../rcyc-user/rcyc-user.service';


@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: RcycAssessmentRecord.name, schema: RcycAssessmentRecordSchema }],
      'Rcyc'),
      MongooseModule.forFeature(
        [{ name: RcycUser.name, schema: RcycUserSchema }],
        'Rcyc'),
        MongooseModule.forFeature([
          { name: RcycAssessmentQuestions.name, schema: RcycAssessmentQuestionsSchema }
        ], 'Rcyc')
        
    ],
    controllers: [RcycAssessmentRecordsController],
  providers: [RcycAssessmentRecordsService, RcycUserService],
})
export class RcycAssessmentRecordsModule {}
