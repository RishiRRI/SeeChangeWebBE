import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { See360AssessmentQuestionsService } from './see-360-assessment-questions.service';
import { CreateSee360AssessmentQuestionDto } from './dto/create-see-360-assessment-question.dto';
import { UpdateSee360AssessmentQuestionDto } from './dto/update-see-360-assessment-question.dto';

@Controller('/see360AssessmentQuestions/')
export class See360AssessmentQuestionsController {
  constructor(
    private readonly see360AssessmentQuestionsService: See360AssessmentQuestionsService,
  ) {}

  @Post()
  create(@Body() createSee360AssessmentQuestionDto: CreateSee360AssessmentQuestionDto) {
    return this.see360AssessmentQuestionsService.create(createSee360AssessmentQuestionDto);
  }

  @Get()
  findAll() {
    return this.see360AssessmentQuestionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.see360AssessmentQuestionsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSee360AssessmentQuestionDto: UpdateSee360AssessmentQuestionDto,
  ) {
    return this.see360AssessmentQuestionsService.update(
      id,
      updateSee360AssessmentQuestionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.see360AssessmentQuestionsService.remove(id);
  }
}
