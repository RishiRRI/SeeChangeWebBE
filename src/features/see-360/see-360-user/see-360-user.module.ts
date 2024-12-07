import { Module } from '@nestjs/common';
import { See360UserService } from './see-360-user.service';
import { See360UserController } from './see-360-user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { See360User, See360UserSchema } from './entities/see-360-user.entity';
import { See360AuthService } from './see-360-auth.service';
import { See360JwtStrategy } from './see-360-jwt.strategy';
import { UpdateController } from 'src/update/update.controller';
import { PassportModule } from '@nestjs/passport';
import { See360AuthController } from './see-360-auth.controller';
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
      [{ name: See360User.name, schema: See360UserSchema }],
      'See360'),
  ],
  controllers: [See360AuthController, See360UserController],
  providers: [
    See360AuthService,
    See360UserService,
    See360JwtStrategy,
    UpdateController,
  ],
  exports: [
    See360JwtStrategy,
    PassportModule,
    See360UserService,
  ],
})
export class See360UserModule {}
