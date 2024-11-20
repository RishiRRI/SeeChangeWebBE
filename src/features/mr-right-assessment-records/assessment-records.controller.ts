import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssessmentRecordsService } from './assessment-records.service';
import { CreateAssessmentRecordDto } from './dto/create-assessment-record.dto';
import { UpdateAssessmentRecordDto } from './dto/update-assessment-record.dto';
import { AssessmentRecord } from './entities/assessment-record.entity';

@Controller('/mrRightAssessmentRecords/')
export class AssessmentRecordsController {
  constructor(
    private readonly assessmentRecordsService: AssessmentRecordsService,
  ) {}

  @Post()
  async create(@Body() createAssessmentRecordDto: CreateAssessmentRecordDto) {
    return this.assessmentRecordsService.create(createAssessmentRecordDto);
  }

  @Get()
  async findAll(): Promise<AssessmentRecord[]> {
    return this.assessmentRecordsService.findAll();
  }

  @Get('/getAssessmentRecordListByUser/:id')
async getAssessmentRecordListByUser(@Param('id') id: string): Promise<AssessmentRecord[]> {
  // console.log("User ID:", id); 
  return this.assessmentRecordsService.findAssessmentRecordListByUser(id);
}




  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.assessmentRecordsService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssessmentRecordDto: UpdateAssessmentRecordDto,
  ): Promise<AssessmentRecord> {
    return this.assessmentRecordsService.update(id, updateAssessmentRecordDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.assessmentRecordsService.remove(id);
  }

  @Get('/getAssessmentRecord/:id')
  async getAssessmentRecord(@Param('id') id: string) {
    return this.assessmentRecordsService.findOne1(id);
  }

  @Get('/getRatingCounts/:id')
  async getRatingCounts(@Param('id') id: string) {
      return this.assessmentRecordsService.getRatingCounts(id);
  }
}
