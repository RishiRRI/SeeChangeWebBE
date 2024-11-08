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
    // MongooseModule.forRoot(process.env.See_Change_Web_DB, {
      MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionName: 'See_Change_Web',
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
