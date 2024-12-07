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
import { See360UserService } from './see-360-user.service';
import { See360AuthService } from './see-360-auth.service';
import { See360LoginDto } from './dto/see-360-login.dto';

@Controller('/see360Auth/')
export class See360AuthController {
  constructor(
    private see360AuthService: See360AuthService,
    private readonly see360UserService: See360UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: See360LoginDto, @Req() request: Request) {
    // console.log(signInDto);
    return this.see360AuthService.signIn(
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
      const user = await this.see360UserService.findById(id);
      console.log(`User connected: ${user.fullName}`);

      return `User connected: ${user.fullName}`;
    }

    return 'User ID is empty!';
  }

  @Post('disconnected')
  async handleDisconnect(@Body() payload: { id: string }): Promise<string> {
    const id: string = payload.id;

    if (id.length > 0) {
      const user = await this.see360UserService.findById(id);
      console.log(`User disconnected: ${user.fullName}`);

      return `User disconnected: ${user.fullName}`;
    }

    return 'User ID is empty!';
  }
}
