import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './features/mr-right-user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UpdateController } from './update/update.controller';
import { AssessmentQuestionsModule } from './features/mr-right-assessment-questions/assessment-questions.module';
import { AssessmentRecordsModule } from './features/mr-right-assessment-records/assessment-records.module';
import { PaymentsModule } from './features/mr-right-payments/payments.module';
import { RcycUserModule } from './features/rcyc-user/rcyc-user.module';
import { RcycAssessmentQuestionsModule } from './features/rcyc-assessment-questions/rcyc-assessment-questions.module';
import { RcycAssessmentRecordsModule } from './features/rcyc-assessment-records/rcyc-assessment-records.module';
import { RcycPaymentsModule } from './features/rcyc-payments/rcyc-payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // MongooseModule.forRoot(process.env.MrRight_DB, {
      MongooseModule.forRoot(process.env.MONGODB_MrRight, {
      connectionName: 'MrRight',
    }),
    // MongooseModule.forRoot(process.env.Rcyc_D/B, {
      MongooseModule.forRoot(process.env.MONGODB_Rcyc, {
      connectionName: 'Rcyc',
    }),
    UserModule,
    AssessmentQuestionsModule,
    AssessmentRecordsModule,
    PaymentsModule,
    RcycUserModule,
    RcycAssessmentQuestionsModule,
    RcycAssessmentRecordsModule,
    RcycPaymentsModule,
  ],
  controllers: [AppController, UpdateController],
  providers: [AppService],
})
export class AppModule {}
