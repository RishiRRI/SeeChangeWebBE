import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name, 'MrRight')
    private userModel: mongoose.Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // console.log(createUserDto);
    const { password, ...rest } = createUserDto;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const newUser = new this.userModel({
      ...rest,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByPhoneNumber(phoneNumber: string) {
    return this.userModel.findOne({
      phoneNumber: phoneNumber,
    });
  }

  async getUserCounts(): Promise<{ superAdminCount: number; personalCount: number; enterpriseCount: number }> {
    const superAdminCount = await this.userModel.countDocuments({ accountType: 'admin' });
    const personalCount = await this.userModel.countDocuments({ accountType: 'personal' });
    const enterpriseCount = await this.userModel.countDocuments({ accountType: 'enterprise' });

    return { superAdminCount, personalCount, enterpriseCount };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
  
    // Fetch the current user to check existing pdfAccess
    const currentUser = await this.userModel.findById(id).exec();
    if (!currentUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  
    // If pdfAccess is provided in the update, merge it with existing ones
    if (updateUserDto.pdfAccess) {
      // Combine current pdfAccess with the new ones, removing duplicates
      const existingPdfAccess = new Set(currentUser.pdfAccess);
      updateUserDto.pdfAccess.forEach(pdf => existingPdfAccess.add(pdf));
      
      // Convert back to array
      updateUserDto.pdfAccess = Array.from(existingPdfAccess);
    }
  
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  
    return updatedUser;
  }
  
  

  async deleteUser(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  async updateUserSessionToken(userId: string, sessionToken: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { sessionToken: sessionToken },
      { new: true } // return the updated document
    ).exec();
  }
  async updateUserStatus(userId: string, userStatus: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { userStatus: userStatus },
      { new: true } 
    ).exec();
  }
}
