import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RcycUserService } from './rcyc-user.service';
import { CreateRcycUserDto } from './dto/create-rcyc-user.dto';
import { RcycUser } from './entities/rcyc-user.entity';
import { UpdateRcycUserDto } from './dto/update-rcyc-user.dto';
import { json } from 'stream/consumers';

@Controller('/rcycUsers/')
export class RcycUserController {
  constructor(private readonly rcycUserService: RcycUserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateRcycUserDto) {
    // var createUserDto: CreateUserDto = JSON.parse(payload.userModel);
    console.log(createUserDto)
    return this.rcycUserService.createUser(createUserDto);
  }

  @Get()
  async findAll(): Promise<RcycUser[]> {
    return this.rcycUserService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<RcycUser> {
    return this.rcycUserService.findById(id);
  }

  @Get('stats/userCounts')
  async getUserCounts(): Promise<{ superAdminCount: number; personalCount: number; enterpriseCount: number }> {
    return this.rcycUserService.getUserCounts();
  }
  

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateRcycUserDto: UpdateRcycUserDto,
  ): Promise<RcycUser> {
    return this.rcycUserService.updateUser(id, updateRcycUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<RcycUser> {
    return this.rcycUserService.deleteUser(id);
  }
}
