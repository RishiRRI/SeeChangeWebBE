import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './features/mr-right/mr-right-user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UpdateController } from './update/update.controller';
import { AssessmentQuestionsModule } from './features/mr-right/mr-right-assessment-questions/assessment-questions.module';
import { AssessmentRecordsModule } from './features/mr-right/mr-right-assessment-records/assessment-records.module';
import { PaymentsModule } from './features/mr-right/mr-right-payments/payments.module';
import { RcycUserModule } from './features/rcyc/rcyc-user/rcyc-user.module';
import { RcycAssessmentQuestionsModule } from './features/rcyc/rcyc-assessment-questions/rcyc-assessment-questions.module';
import { RcycAssessmentRecordsModule } from './features/rcyc/rcyc-assessment-records/rcyc-assessment-records.module';
import { RcycPaymentsModule } from './features/rcyc/rcyc-payments/rcyc-payments.module';
import { See360UserModule } from './features/see-360/see-360-user/see-360-user.module';
import { See360AssessmentQuestionsModule } from './features/see-360/see-360-assessment-questions/see-360-assessment-questions.module';
import { See360PaymentsModule } from './features/see-360/see-360-payments/see-360-payments.module';
import { See360AssessmentRecordsModule } from './features/see-360/see-360-assessment-records/see-360-assessment-records.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MrRight_DB, {
      // MongooseModule.forRoot(process.env.MONGODB_MrRight, {
      connectionName: 'MrRight',
    }),
    MongooseModule.forRoot(process.env.Rcyc_DB, {
      // MongooseModule.forRoot(process.env.MONGODB_Rcyc, {
      connectionName: 'Rcyc',
    }),
    MongooseModule.forRoot(process.env.See360_DB, {
      // MongooseModule.forRoot(process.env.MONGODB_See360, {
      connectionName: 'See360',
    }),
    UserModule,
    AssessmentQuestionsModule,
    AssessmentRecordsModule,
    PaymentsModule,
    RcycUserModule,
    RcycAssessmentQuestionsModule,
    RcycAssessmentRecordsModule,
    RcycPaymentsModule,
    See360UserModule,
    See360AssessmentQuestionsModule,
    See360AssessmentRecordsModule,
    See360PaymentsModule,
  ],
  controllers: [AppController, UpdateController],
  providers: [AppService],
})
export class AppModule {}
