import { Module } from '@nestjs/common';
import { See360AssessmentRecordsService } from './see-360-assessment-records.service';
import { See360AssessmentRecordsController } from './see-360-assessment-records.controller';
import { See360AssessmentRecord, See360AssessmentRecordSchema } from './entities/see-360-assessment-record.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { See360User, See360UserSchema } from '../see-360-user/entities/see-360-user.entity';
import { See360AssessmentQuestions, See360AssessmentQuestionsSchema } from '../see-360-assessment-questions/entities/see-360-assessment-question.entity';
import { See360UserService } from '../see-360-user/see-360-user.service';


@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: See360AssessmentRecord.name, schema: See360AssessmentRecordSchema }],
      'See360'),
      MongooseModule.forFeature(
        [{ name: See360User.name, schema: See360UserSchema }],
        'See360'),
        MongooseModule.forFeature([
          { name: See360AssessmentQuestions.name, schema: See360AssessmentQuestionsSchema }
        ], 'See360')
        
    ],
    controllers: [See360AssessmentRecordsController],
  providers: [See360AssessmentRecordsService, See360UserService],
})
export class See360AssessmentRecordsModule {}
