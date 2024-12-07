import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { See360User } from './entities/see-360-user.entity';

@Injectable()
export class See360JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(See360User.name, 'See360')
    private see360UserModel: Model<See360User>,
  ) {
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    
    const { id } = payload;

    const user = await this.see360UserModel.findById(id);

    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    return user;
  }
}
