import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AssessmentQuestionsService } from './assessment-questions.service';
import { CreateAssessmentQuestionDto } from './dto/create-assessment-question.dto';
import { UpdateAssessmentQuestionDto } from './dto/update-assessment-question.dto';

@Controller('/mrRightAssessmentQuestions/')
export class AssessmentQuestionsController {
  constructor(
    private readonly assessmentQuestionsService: AssessmentQuestionsService,
  ) {}

  @Post()
  create(@Body() createAssessmentQuestionDto: CreateAssessmentQuestionDto) {
    return this.assessmentQuestionsService.create(createAssessmentQuestionDto);
  }

  @Get()
  findAll() {
    return this.assessmentQuestionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentQuestionsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssessmentQuestionDto: UpdateAssessmentQuestionDto,
  ) {
    return this.assessmentQuestionsService.update(
      id,
      updateAssessmentQuestionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assessmentQuestionsService.remove(id);
  }
}
