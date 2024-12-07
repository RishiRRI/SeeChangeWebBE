import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { See360AssessmentRecordsService } from './see-360-assessment-records.service';
import { CreateSee360AssessmentRecordDto } from './dto/create-see-360-assessment-record.dto';
import { UpdateSee360AssessmentRecordDto } from './dto/update-see-360-assessment-record.dto';
import { See360AssessmentRecord } from './entities/see-360-assessment-record.entity';

@Controller('/see360AssessmentRecords/')
export class See360AssessmentRecordsController {
  constructor(
    private readonly see360AssessmentRecordsService: See360AssessmentRecordsService,
  ) {}

  @Post()
  async create(
    @Body() createSee360AssessmentRecordDto: CreateSee360AssessmentRecordDto,
  ) {
    // console.log("createSee360AssessmentRecordDto is here :", createSee360AssessmentRecordDto);
    return this.see360AssessmentRecordsService.create(
      createSee360AssessmentRecordDto,
    );
  }

  @Get()
  async findAll(): Promise<See360AssessmentRecord[]> {
    return this.see360AssessmentRecordsService.findAll();
  }

  @Get('/getAssessmentRecordListByUser/:id')
  async getAssessmentRecordListByUser(
    @Param('id') id: string,
  ): Promise<See360AssessmentRecord[]> {
    // console.log("User ID:", id);
    return this.see360AssessmentRecordsService.findAssessmentRecordListByUser(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.see360AssessmentRecordsService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssessmentRecordDto: UpdateSee360AssessmentRecordDto,
  ): Promise<See360AssessmentRecord> {
    return this.see360AssessmentRecordsService.update(
      id,
      updateAssessmentRecordDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.see360AssessmentRecordsService.remove(id);
  }

//   @Get('/getAssessmentRecord/:id')
//   async getAssessmentRecord(@Param('id') id: string) {
//     return this.see360AssessmentRecordsService.findOne1(id);
//   }

//   @Get('/getRatingCounts/:id')
//   async getRatingCounts(@Param('id') id: string) {
//     return this.see360AssessmentRecordsService.getRatingCounts(id);
//   }
}
