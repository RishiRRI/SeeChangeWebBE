import { CreateAssessmentRecordDto } from './dto/create-assessment-record.dto';
import { UpdateAssessmentRecordDto } from './dto/update-assessment-record.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { AssessmentRecord } from './entities/assessment-record.entity';
import { AssessmentQuestions } from '../assessment-questions/entities/assessment-question.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AssessmentRecordsService {
  constructor(
    private userService: UserService,
    @InjectModel(AssessmentRecord.name , 'See_Change_Web') private assessmentRecordModel: mongoose.Model<AssessmentRecord>,
    @InjectModel(User.name, 'See_Change_Web') private userModel: mongoose.Model<User>,
    @InjectModel(AssessmentQuestions.name, 'See_Change_Web') private questionModel: mongoose.Model<AssessmentQuestions>,
  ) {}

  async create(createAssessmentRecordDto: CreateAssessmentRecordDto): Promise<AssessmentRecord> {
    const { userId, responses } = createAssessmentRecordDto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const formattedResponses = [];

    for (const response of responses) {
      const question = await this.questionModel.findById(response.questionId);
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

    const assessmentRecord = new this.assessmentRecordModel({
      user,
      responses: formattedResponses,
    });
    // console.log(assessmentRecord);

    return assessmentRecord.save();
  }

  async findAll(): Promise<AssessmentRecord[]> {
    return this.assessmentRecordModel.find().sort({ createdAt: -1 });
  }

  async findAssessmentRecordListByUser(user: string): Promise<AssessmentRecord[]> {
    const assessmentRecords = await this.assessmentRecordModel
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
  

  
  async findById(id: string): Promise<AssessmentRecord> {
    const assessmentRecord = await this.assessmentRecordModel.findById(id).exec();
    if (!assessmentRecord) {
      throw new NotFoundException(`assessmentRecord with ID ${id} not found`);
    }
    return assessmentRecord;
  }
  

  async findOne1(id: string): Promise<any> {
    const assessmentRecord = await this.assessmentRecordModel
    .findById(id)
    // .populate({
    //   path: 'responses.question',
    //   model: this.questionModel.modelName, // Explicitly specify the model name
    //   select: 'mainQuestion options'
    // })
    // .exec();
  

    if (!assessmentRecord) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    const user = await this.userModel.findById(assessmentRecord.user).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${assessmentRecord.user} not found`);
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

  async update(id: string, updateAssessmentRecordDto: UpdateAssessmentRecordDto): Promise<AssessmentRecord> {
    const assessmentRecord = await this.assessmentRecordModel.findByIdAndUpdate(
      id,
      updateAssessmentRecordDto,
      { new: true } // Return the updated document
    );

    if (!assessmentRecord) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    return assessmentRecord;
  }

  async remove(id: string): Promise<any> {
    const result = await this.assessmentRecordModel.findByIdAndDelete(id);
    
    if (!result) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    return { message: `Assessment record with ID ${id} deleted successfully` };
  }
}