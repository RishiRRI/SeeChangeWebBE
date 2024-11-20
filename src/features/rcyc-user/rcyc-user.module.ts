import { Module } from '@nestjs/common';
import { RcycUserService } from './rcyc-user.service';
import { RcycUserController } from './rcyc-user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RcycUser, RcycUserSchema } from './entities/rcyc-user.entity';
import { RcycAuthService } from './rcyc-auth.service';
import { RcycJwtStrategy } from './rcyc-jwt.strategy';
import { UpdateController } from 'src/update/update.controller';
import { PassportModule } from '@nestjs/passport';
import { RcycAuthController } from './rcyc-auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forFeature(
      [{ name: RcycUser.name, schema: RcycUserSchema }],
      'Rcyc'),
  ],
  controllers: [RcycAuthController, RcycUserController],
  providers: [
    RcycAuthService,
    RcycUserService,
    RcycJwtStrategy,
    UpdateController,
  ],
  exports: [
    RcycJwtStrategy,
    PassportModule,
    RcycUserService,
  ],
})
export class RcycUserModule {}
