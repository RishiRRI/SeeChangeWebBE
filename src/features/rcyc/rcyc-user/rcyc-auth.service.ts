import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';import { Request } from 'express';
import { log } from 'console';
import { UpdateController } from 'src/update/update.controller';
import { RcycUserService } from './rcyc-user.service';

@Injectable()
export class RcycAuthService {
  constructor(
    private rcycUserService: RcycUserService,
    private jwtService: JwtService,
    private updateController: UpdateController,
  ) {}

  /**
   * Signs a user in with their phone number and password.
   *
   * @param phoneNumber The user's phone number.
   * @param password The user's password.
   * @param request The request object.
   * @returns A promise that resolves with the user's auth token if successful,
   * or rejects with an error if login fails.
   */
  async signIn(
    phoneNumber: string,
    password: string,
    version: string,
    request: Request,

  ): Promise<any> {
    const user = await this.rcycUserService.findByPhoneNumber(phoneNumber);

    const latestApk = this.updateController.getLatestApk();
    if(latestApk.version != "1.0.0"){
      throw new NotFoundException('Version doesn\'t match \nPlease update the app');
    }
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect password');
    }
    const token = this.jwtService.sign({ id: user._id });
    await this.rcycUserService.updateUserSessionToken(user.id, token);

    console.log(token);
    return {
      success: true,
      token: token,
      id: user._id,
      msg: 'Login Successful',
    };
  }
}