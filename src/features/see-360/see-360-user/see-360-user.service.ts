import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { See360User } from './entities/see-360-user.entity';
import { CreateSee360UserDto } from './dto/create-see-360-user.dto';
import { UpdateSee360UserDto } from './dto/update-see-360-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class See360UserService {

  constructor(
    @InjectModel(See360User.name, 'See360')
    private see360UserModel: mongoose.Model<See360User>,
  ) {}

  async createUser(createRcycUserDto: CreateSee360UserDto): Promise<See360User> {
    // console.log(createRcycUserDto);
    const { password, ...rest } = createRcycUserDto;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const newUser = new this.see360UserModel({
      ...rest,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async findAll(): Promise<See360User[]> {
    return this.see360UserModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<See360User> {
    const user = await this.see360UserModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByPhoneNumber(phoneNumber: string) {
    return this.see360UserModel.findOne({
      phoneNumber: phoneNumber,
    });
  }

  async getUserCounts(): Promise<{ superAdminCount: number; personalCount: number; enterpriseCount: number }> {
    const superAdminCount = await this.see360UserModel.countDocuments({ accountType: 'admin' });
    const personalCount = await this.see360UserModel.countDocuments({ accountType: 'personal' });
    const enterpriseCount = await this.see360UserModel.countDocuments({ accountType: 'enterprise' });

    return { superAdminCount, personalCount, enterpriseCount };
  }

  async updateUser(id: string, updateRcycUserDto: UpdateSee360UserDto): Promise<See360User> {
    if (updateRcycUserDto.password) {
      const saltRounds = 10;
      updateRcycUserDto.password = await bcrypt.hash(updateRcycUserDto.password, saltRounds);
    }
  
    // Fetch the current user to check existing pdfAccess
    const currentUser = await this.see360UserModel.findById(id).exec();
    if (!currentUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  
    // If pdfAccess is provided in the update, merge it with existing ones
    if (updateRcycUserDto.pdfAccess) {
      // Combine current pdfAccess with the new ones, removing duplicates
      const existingPdfAccess = new Set(currentUser.pdfAccess);
      updateRcycUserDto.pdfAccess.forEach(pdf => existingPdfAccess.add(pdf));
      
      // Convert back to array
      updateRcycUserDto.pdfAccess = Array.from(existingPdfAccess);
    }
  
    const updatedUser = await this.see360UserModel
      .findByIdAndUpdate(id, updateRcycUserDto, { new: true })
      .exec();
  
    return updatedUser;
  }
  
  

  async deleteUser(id: string): Promise<See360User> {
    const deletedUser = await this.see360UserModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  async updateUserSessionToken(userId: string, sessionToken: string): Promise<See360User> {
    return this.see360UserModel.findByIdAndUpdate(
      userId,
      { sessionToken: sessionToken },
      { new: true } // return the updated document
    ).exec();
  }
  async updateUserStatus(userId: string, userStatus: string): Promise<See360User> {
    return this.see360UserModel.findByIdAndUpdate(
      userId,
      { userStatus: userStatus },
      { new: true } 
    ).exec();
  }
}
