import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RcycAssessmentRecordsService } from './rcyc-assessment-records.service';
import { CreateRcycAssessmentRecordDto } from './dto/create-rcyc-assessment-record.dto';
import { UpdateRcycAssessmentRecordDto } from './dto/update-rcyc-assessment-record.dto';
import { RcycAssessmentRecord } from './entities/rcyc-assessment-record.entity';

@Controller('/rcycAssessmentRecords/')
export class RcycAssessmentRecordsController {
  constructor(
    private readonly rcycAssessmentRecordsService: RcycAssessmentRecordsService,
  ) {}

  @Post()
  async create(
    @Body() createRcycAssessmentRecordDto: CreateRcycAssessmentRecordDto,
  ) {
    // console.log("createRcycAssessmentRecordDto is here :", createRcycAssessmentRecordDto);
    return this.rcycAssessmentRecordsService.create(
      createRcycAssessmentRecordDto,
    );
  }

  @Get()
  async findAll(): Promise<RcycAssessmentRecord[]> {
    return this.rcycAssessmentRecordsService.findAll();
  }

  @Get('/getAssessmentRecordListByUser/:id')
  async getAssessmentRecordListByUser(
    @Param('id') id: string,
  ): Promise<RcycAssessmentRecord[]> {
    // console.log("User ID:", id);
    return this.rcycAssessmentRecordsService.findAssessmentRecordListByUser(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.rcycAssessmentRecordsService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssessmentRecordDto: UpdateRcycAssessmentRecordDto,
  ): Promise<RcycAssessmentRecord> {
    return this.rcycAssessmentRecordsService.update(
      id,
      updateAssessmentRecordDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.rcycAssessmentRecordsService.remove(id);
  }

  @Get('/getAssessmentRecord/:id')
  async getAssessmentRecord(@Param('id') id: string) {
    return this.rcycAssessmentRecordsService.findOne1(id);
  }

  @Get('/getRatingCounts/:id')
  async getRatingCounts(@Param('id') id: string) {
    return this.rcycAssessmentRecordsService.getRatingCounts(id);
  }
}
