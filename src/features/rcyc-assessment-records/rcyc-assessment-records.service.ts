import { CreateRcycAssessmentRecordDto } from './dto/create-rcyc-assessment-record.dto';
import { UpdateRcycAssessmentRecordDto } from './dto/update-rcyc-assessment-record.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { RcycAssessmentRecord } from './entities/rcyc-assessment-record.entity';
import { RcycAssessmentQuestions } from '../rcyc-assessment-questions/entities/rcyc-assessment-question.entity';
import { RcycUserService } from '../rcyc-user/rcyc-user.service';
import { RcycUser } from '../rcyc-user/entities/rcyc-user.entity';

@Injectable()
export class RcycAssessmentRecordsService {
  constructor(
    private userService: RcycUserService,
    @InjectModel(RcycAssessmentRecord.name , 'Rcyc') private rcycAssessmentRecordModel: mongoose.Model<RcycAssessmentRecord>,
    @InjectModel(RcycUser.name, 'Rcyc') private rcycUserModel: mongoose.Model<RcycUser>,
    @InjectModel(RcycAssessmentQuestions.name, 'Rcyc') private rcycQuestionModel: mongoose.Model<RcycAssessmentQuestions>,
  ) {}

  async create(createRcycAssessmentRecordDto: CreateRcycAssessmentRecordDto): Promise<RcycAssessmentRecord> {
    const { userId, responses } = createRcycAssessmentRecordDto;

    const user = await this.rcycUserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const formattedResponses = [];

    for (const response of responses) {
      const question = await this.rcycQuestionModel.findById(response.questionId);
      if (!question) {
        throw new NotFoundException(`Question with ID ${response.questionId} not found`);
      }

      const ratings = response.ratings.map((rating, index) => ({
        option: question.options[index].option,
        rating: rating.rating,
      }));

      formattedResponses.push({
        question: response.questionId,
        questionName: question.mainQuestion,  
        ratings,
      });
    }
    await this.userService.updateUserStatus(user.id, "assessmentDone");

    const assessmentRecord = new this.rcycAssessmentRecordModel({
      user,
      responses: formattedResponses,
    });
    // console.log(assessmentRecord);

    return assessmentRecord.save();
  }

  async findAll(): Promise<RcycAssessmentRecord[]> {
    return this.rcycAssessmentRecordModel.find().sort({ createdAt: -1 });
  }

  async findAssessmentRecordListByUser(user: string): Promise<RcycAssessmentRecord[]> {
    const assessmentRecords = await this.rcycAssessmentRecordModel
      .find({ user: new Types.ObjectId(user) }) 
      // .populate('user') 
      // .populate('responses.question') 
      .sort({ createdAt: -1 })
      .exec();
  
    if (!assessmentRecords || assessmentRecords.length === 0) {
      throw new NotFoundException(`No assessment records found for user "${user}"`);
    }
  
    return assessmentRecords;
  }
  

  
  async findById(id: string): Promise<RcycAssessmentRecord> {
    const assessmentRecord = await this.rcycAssessmentRecordModel.findById(id).exec();
    if (!assessmentRecord) {
      throw new NotFoundException(`assessmentRecord with ID ${id} not found`);
    }
    return assessmentRecord;
  }
  

  async findOne1(id: string): Promise<any> {
    const assessmentRecord = await this.rcycAssessmentRecordModel
    .findById(id)
    // .populate({
    //   path: 'responses.question',
    //   model: this.rcycQuestionModel.modelName, // Explicitly specify the model name
    //   select: 'mainQuestion options'
    // })
    // .exec();
  

    if (!assessmentRecord) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    const user = await this.rcycUserModel.findById(assessmentRecord.rcycUser).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${assessmentRecord.rcycUser} not found`);
    }

    const optionStats = {
      option1: { 1: 0, 2: 0, 3: 0, 4: 0 },
      option2: { 1: 0, 2: 0, 3: 0, 4: 0 },
      option3: { 1: 0, 2: 0, 3: 0, 4: 0 },
      option4: { 1: 0, 2: 0, 3: 0, 4: 0 },
    };

    let attendedQuestionsCount = 0;

    assessmentRecord.responses.forEach(response => {
      attendedQuestionsCount += 1;

      response.ratings.forEach((rating, index) => {
        const optionKey = `option${index + 1}`; 
        const ratingValue = rating.rating;

        if (optionStats[optionKey][ratingValue] !== undefined) {
          optionStats[optionKey][ratingValue] += 1;
        }
      });
    });

    return {
      user: {
        userId: user._id,
        // fullName: user.fullName,
        // email: user.email,
        // phoneNumber: user.phoneNumber,
      },
      // Date: assessmentRecord.createdAt,
      attendedQuestionsCount,
      optionStats,
    };
  }

  async update(id: string, updateRcycAssessmentRecordDto: UpdateRcycAssessmentRecordDto): Promise<RcycAssessmentRecord> {
    const assessmentRecord = await this.rcycAssessmentRecordModel.findByIdAndUpdate(
      id,
      updateRcycAssessmentRecordDto,
      { new: true } // Return the updated document
    );

    if (!assessmentRecord) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    return assessmentRecord;
  }

  async remove(id: string): Promise<any> {
    const result = await this.rcycAssessmentRecordModel.findByIdAndDelete(id);
    
    if (!result) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    return { message: `Assessment record with ID ${id} deleted successfully` };
  }
}