import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './features/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UpdateController } from './update/update.controller';
import { AssessmentQuestionsModule } from './features/assessment-questions/assessment-questions.module';
import { AssessmentRecordsModule } from './features/assessment-records/assessment-records.module';
import { PaymentsModule } from './features/payments/payments.module';


@Module({
  imports: [    
    ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
  // MongooseModule.forRoot(process.env.USER_DB, {
  //   connectionName: 'See_Change_Web',
  // }),
  // MongooseModule.forRoot(process.env.ASSESSMENT_QUESTIONS_DB, {
  //   connectionName: 'See_Change_Web',
  // }),
  // MongooseModule.forRoot(process.env.ASSESSMENT_RECORDS_DB, {
  //   connectionName: 'See_Change_Web',
  // }),
  MongooseModule.forRoot(process.env.See_Change_Web_DB, {
    connectionName: 'See_Change_Web',
    serverSelectionTimeoutMS: 5000, // Adjust the timeout as necessary
  }),  
    UserModule,
    AssessmentQuestionsModule,
    AssessmentRecordsModule,
    PaymentsModule,
  ],
  controllers: [AppController, UpdateController],
  providers: [AppService],
})
export class AppModule {}