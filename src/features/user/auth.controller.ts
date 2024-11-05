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
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('/auth/')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto, @Req() request: Request) {
    // console.log(signInDto);
    return this.authService.signIn(
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
      const user = await this.userService.findById(id);
      console.log(`User connected: ${user.fullName}`);

      return `User connected: ${user.fullName}`;
    }

    return 'User ID is empty!';
  }

  @Post('disconnected')
  async handleDisconnect(@Body() payload: { id: string }): Promise<string> {
    const id: string = payload.id;

    if (id.length > 0) {
      const user = await this.userService.findById(id);
      console.log(`User disconnected: ${user.fullName}`);

      return `User disconnected: ${user.fullName}`;
    }

    return 'User ID is empty!';
  }
}
