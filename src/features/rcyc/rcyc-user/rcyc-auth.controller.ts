import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  HostParam,
  Req,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RcycUserService } from './rcyc-user.service';
import { RcycAuthService } from './rcyc-auth.service';
import { RcycLoginDto } from './dto/rcyc-login.dto';

@Controller('/rcycAuth/')
export class RcycAuthController {
  constructor(
    private rcycAuthService: RcycAuthService,
    private readonly rcycUserService: RcycUserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: RcycLoginDto, @Req() request: Request) {
    // console.log(signInDto);
    return this.rcycAuthService.signIn(
      signInDto.phoneNumber,
      signInDto.password,
      signInDto.version,
      request,
    );
  }

  @UseGuards(AuthGuard())
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('connected')
  async handleConnect(@Body() payload: { id: string }): Promise<string> {
    const id: string = payload.id;

    if (id.length > 0) {
      const user = await this.rcycUserService.findById(id);
      console.log(`User connected: ${user.fullName}`);

      return `User connected: ${user.fullName}`;
    }

    return 'User ID is empty!';
  }

  @Post('disconnected')
  async handleDisconnect(@Body() payload: { id: string }): Promise<string> {
    const id: string = payload.id;

    if (id.length > 0) {
      const user = await this.rcycUserService.findById(id);
      console.log(`User disconnected: ${user.fullName}`);

      return `User disconnected: ${user.fullName}`;
    }

    return 'User ID is empty!';
  }
}
