import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateRcycAssessmentQuestionDto } from './dto/create-rcyc-assessment-question.dto';
import { UpdateRcycAssessmentQuestionDto } from './dto/update-rcyc-assessment-question.dto';
import { RcycAssessmentQuestions } from './entities/rcyc-assessment-question.entity';

@Injectable()
export class RcycAssessmentQuestionsService {
  constructor(
    @InjectModel(RcycAssessmentQuestions.name , 'Rcyc') 
    private rcycAssessmentQuestionsModel: mongoose.Model<RcycAssessmentQuestions>,
  ) {}

  async create(createRcycAssessmentQuestionDto: CreateRcycAssessmentQuestionDto): Promise<RcycAssessmentQuestions> {
    const newQuestion = new this.rcycAssessmentQuestionsModel(createRcycAssessmentQuestionDto);
    return newQuestion.save();
  }

  async findAll(): Promise<RcycAssessmentQuestions[]> {
    return this.rcycAssessmentQuestionsModel.find();
  }

  async findOne(id: string): Promise<RcycAssessmentQuestions> {
    const question = await this.rcycAssessmentQuestionsModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(id: string, updateRcycAssessmentQuestionDto: UpdateRcycAssessmentQuestionDto): Promise<RcycAssessmentQuestions> {
    const updatedQuestion = await this.rcycAssessmentQuestionsModel
      .findByIdAndUpdate(id, updateRcycAssessmentQuestionDto, { new: true })
      .exec();
    if (!updatedQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return updatedQuestion;
  }

  async remove(id: string): Promise<void> {
    const result = await this.rcycAssessmentQuestionsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
  }
}
