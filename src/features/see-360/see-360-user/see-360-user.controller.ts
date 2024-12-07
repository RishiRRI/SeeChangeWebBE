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
import { See360UserService } from './see-360-user.service';
import { CreateSee360UserDto } from './dto/create-see-360-user.dto';
import { See360User } from './entities/see-360-user.entity';
import { UpdateSee360UserDto } from './dto/update-see-360-user.dto';
import { json } from 'stream/consumers';

@Controller('/see360Users/')
export class See360UserController {
  constructor(private readonly see360UserService: See360UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateSee360UserDto) {
    // var createUserDto: CreateUserDto = JSON.parse(payload.userModel);
    // console.log(createUserDto)
    return this.see360UserService.createUser(createUserDto);
  }

  @Get()
  async findAll(): Promise<See360User[]> {
    return this.see360UserService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<See360User> {
    return this.see360UserService.findById(id);
  }

  @Get('stats/userCounts')
  async getUserCounts(): Promise<{ superAdminCount: number; personalCount: number; enterpriseCount: number }> {
    return this.see360UserService.getUserCounts();
  }
  

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateSee360UserDto: UpdateSee360UserDto,
  ): Promise<See360User> {
    return this.see360UserService.updateUser(id, updateSee360UserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<See360User> {
    return this.see360UserService.deleteUser(id);
  }
}
