import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateSee360AssessmentQuestionDto } from './dto/create-see-360-assessment-question.dto';
import { UpdateSee360AssessmentQuestionDto } from './dto/update-see-360-assessment-question.dto';
import { See360AssessmentQuestions } from './entities/see-360-assessment-question.entity';

@Injectable()
export class See360AssessmentQuestionsService {
  constructor(
    @InjectModel(See360AssessmentQuestions.name , 'See360') 
    private see360AssessmentQuestionsModel: mongoose.Model<See360AssessmentQuestions>,
  ) {}

  async create(createSee360AssessmentQuestionDto: CreateSee360AssessmentQuestionDto): Promise<See360AssessmentQuestions> {
    const newQuestion = new this.see360AssessmentQuestionsModel(createSee360AssessmentQuestionDto);
    return newQuestion.save();
  }

  async findAll(): Promise<See360AssessmentQuestions[]> {
    return this.see360AssessmentQuestionsModel.find();
  }

  async findOne(id: string): Promise<See360AssessmentQuestions> {
    const question = await this.see360AssessmentQuestionsModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(id: string, updateSee360AssessmentQuestionDto: UpdateSee360AssessmentQuestionDto): Promise<See360AssessmentQuestions> {
    const updatedQuestion = await this.see360AssessmentQuestionsModel
      .findByIdAndUpdate(id, updateSee360AssessmentQuestionDto, { new: true })
      .exec();
    if (!updatedQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return updatedQuestion;
  }

  async remove(id: string): Promise<void> {
    const result = await this.see360AssessmentQuestionsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
  }
}
