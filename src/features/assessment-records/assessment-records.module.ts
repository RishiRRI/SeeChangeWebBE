import { Module } from '@nestjs/common';
import { AssessmentRecordsService } from './assessment-records.service';
import { AssessmentRecordsController } from './assessment-records.controller';
import { AssessmentRecord, AssessmentRecordSchema } from './entities/assessment-record.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/entities/user.entity';
import { AssessmentQuestions, AssessmentQuestionsSchema } from '../assessment-questions/entities/assessment-question.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: AssessmentRecord.name, schema: AssessmentRecordSchema }],
      'See_Change_Web'),
      MongooseModule.forFeature(
        [{ name: User.name, schema: UserSchema }],
        'See_Change_Web'),
        MongooseModule.forFeature([
          { name: AssessmentQuestions.name, schema: AssessmentQuestionsSchema }
        ], 'See_Change_Web')
        
    ],
    controllers: [AssessmentRecordsController],
  providers: [AssessmentRecordsService, UserService],
})
export class AssessmentRecordsModule {}
