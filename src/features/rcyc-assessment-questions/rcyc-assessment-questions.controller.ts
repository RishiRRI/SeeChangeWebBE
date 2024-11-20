import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RcycAssessmentQuestionsService } from './rcyc-assessment-questions.service';
import { CreateRcycAssessmentQuestionDto } from './dto/create-rcyc-assessment-question.dto';
import { UpdateRcycAssessmentQuestionDto } from './dto/update-rcyc-assessment-question.dto';

@Controller('/rcycAssessmentQuestions/')
export class RcycAssessmentQuestionsController {
  constructor(
    private readonly rcycAssessmentQuestionsService: RcycAssessmentQuestionsService,
  ) {}

  @Post()
  create(@Body() createRcycAssessmentQuestionDto: CreateRcycAssessmentQuestionDto) {
    return this.rcycAssessmentQuestionsService.create(createRcycAssessmentQuestionDto);
  }

  @Get()
  findAll() {
    return this.rcycAssessmentQuestionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rcycAssessmentQuestionsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRcycAssessmentQuestionDto: UpdateRcycAssessmentQuestionDto,
  ) {
    return this.rcycAssessmentQuestionsService.update(
      id,
      updateRcycAssessmentQuestionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rcycAssessmentQuestionsService.remove(id);
  }
}
