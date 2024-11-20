import { Module } from '@nestjs/common';
import { AssessmentRecordsService } from './assessment-records.service';
import { AssessmentRecordsController } from './assessment-records.controller';
import { AssessmentRecord, AssessmentRecordSchema } from './entities/assessment-record.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../mr-right-user/entities/user.entity';
import { AssessmentQuestions, AssessmentQuestionsSchema } from '../mr-right-assessment-questions/entities/assessment-question.entity';
import { UserService } from '../mr-right-user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: AssessmentRecord.name, schema: AssessmentRecordSchema }],
      'MrRight'),
      MongooseModule.forFeature(
        [{ name: User.name, schema: UserSchema }],
        'MrRight'),
        MongooseModule.forFeature([
          { name: AssessmentQuestions.name, schema: AssessmentQuestionsSchema }
        ], 'MrRight')
        
    ],
    controllers: [AssessmentRecordsController],
  providers: [AssessmentRecordsService, UserService],
})
export class AssessmentRecordsModule {}
