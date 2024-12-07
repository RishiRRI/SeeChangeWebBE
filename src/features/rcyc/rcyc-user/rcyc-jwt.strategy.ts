import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { RcycUser } from './entities/rcyc-user.entity';

@Injectable()
export class RcycJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(RcycUser.name, 'Rcyc')
    private rcycUserModel: Model<RcycUser>,
  ) {
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    
    const { id } = payload;

    const user = await this.rcycUserModel.findById(id);

    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    return user;
  }
}
