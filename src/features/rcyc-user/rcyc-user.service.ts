import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RcycUser } from './entities/rcyc-user.entity';
import { CreateRcycUserDto } from './dto/create-rcyc-user.dto';
import { UpdateRcycUserDto } from './dto/update-rcyc-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class RcycUserService {

  constructor(
    @InjectModel(RcycUser.name, 'Rcyc')
    private rcycuserModel: mongoose.Model<RcycUser>,
  ) {}

  async createUser(createRcycUserDto: CreateRcycUserDto): Promise<RcycUser> {
    // console.log(createRcycUserDto);
    const { password, ...rest } = createRcycUserDto;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const newUser = new this.rcycuserModel({
      ...rest,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async findAll(): Promise<RcycUser[]> {
    return this.rcycuserModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<RcycUser> {
    const user = await this.rcycuserModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByPhoneNumber(phoneNumber: string) {
    return this.rcycuserModel.findOne({
      phoneNumber: phoneNumber,
    });
  }

  async getUserCounts(): Promise<{ superAdminCount: number; personalCount: number; enterpriseCount: number }> {
    const superAdminCount = await this.rcycuserModel.countDocuments({ accountType: 'admin' });
    const personalCount = await this.rcycuserModel.countDocuments({ accountType: 'personal' });
    const enterpriseCount = await this.rcycuserModel.countDocuments({ accountType: 'enterprise' });

    return { superAdminCount, personalCount, enterpriseCount };
  }

  async updateUser(id: string, updateRcycUserDto: UpdateRcycUserDto): Promise<RcycUser> {
    if (updateRcycUserDto.password) {
      const saltRounds = 10;
      updateRcycUserDto.password = await bcrypt.hash(updateRcycUserDto.password, saltRounds);
    }
  
    // Fetch the current user to check existing pdfAccess
    const currentUser = await this.rcycuserModel.findById(id).exec();
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
  
    const updatedUser = await this.rcycuserModel
      .findByIdAndUpdate(id, updateRcycUserDto, { new: true })
      .exec();
  
    return updatedUser;
  }
  
  

  async deleteUser(id: string): Promise<RcycUser> {
    const deletedUser = await this.rcycuserModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  async updateUserSessionToken(userId: string, sessionToken: string): Promise<RcycUser> {
    return this.rcycuserModel.findByIdAndUpdate(
      userId,
      { sessionToken: sessionToken },
      { new: true } // return the updated document
    ).exec();
  }
  async updateUserStatus(userId: string, userStatus: string): Promise<RcycUser> {
    return this.rcycuserModel.findByIdAndUpdate(
      userId,
      { userStatus: userStatus },
      { new: true } 
    ).exec();
  }
}
