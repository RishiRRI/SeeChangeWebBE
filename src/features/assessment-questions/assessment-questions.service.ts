import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateAssessmentQuestionDto } from './dto/create-assessment-question.dto';
import { UpdateAssessmentQuestionDto } from './dto/update-assessment-question.dto';
import { AssessmentQuestions } from './entities/assessment-question.entity';

@Injectable()
export class AssessmentQuestionsService {
  constructor(
    @InjectModel(AssessmentQuestions.name , 'See_Change_Web') 
    private assessmentQuestionsModel: mongoose.Model<AssessmentQuestions>,
  ) {}

  async create(createAssessmentQuestionDto: CreateAssessmentQuestionDto): Promise<AssessmentQuestions> {
    const newQuestion = new this.assessmentQuestionsModel(createAssessmentQuestionDto);
    return newQuestion.save();
  }

  async findAll(): Promise<AssessmentQuestions[]> {
    return this.assessmentQuestionsModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<AssessmentQuestions> {
    const question = await this.assessmentQuestionsModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(id: string, updateAssessmentQuestionDto: UpdateAssessmentQuestionDto): Promise<AssessmentQuestions> {
    const updatedQuestion = await this.assessmentQuestionsModel
      .findByIdAndUpdate(id, updateAssessmentQuestionDto, { new: true })
      .exec();
    if (!updatedQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return updatedQuestion;
  }

  async remove(id: string): Promise<void> {
    const result = await this.assessmentQuestionsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
  }
}
