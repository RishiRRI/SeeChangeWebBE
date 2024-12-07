import { CreateRcycAssessmentRecordDto } from './dto/create-rcyc-assessment-record.dto';
import { UpdateRcycAssessmentRecordDto } from './dto/update-rcyc-assessment-record.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { RcycAssessmentRecord } from './entities/rcyc-assessment-record.entity';
import { RcycAssessmentQuestions } from '../rcyc-assessment-questions/entities/rcyc-assessment-question.entity';
import { RcycUserService } from '../rcyc-user/rcyc-user.service';
import { RcycUser } from '../rcyc-user/entities/rcyc-user.entity';

@Injectable()
export class RcycAssessmentRecordsService {
  constructor(
    private rcycUserService: RcycUserService,
    @InjectModel(RcycAssessmentRecord.name , 'Rcyc') private rcycAssessmentRecordModel: mongoose.Model<RcycAssessmentRecord>,
    @InjectModel(RcycUser.name, 'Rcyc') private rcycUserModel: mongoose.Model<RcycUser>,
    @InjectModel(RcycAssessmentQuestions.name, 'Rcyc') private rcycQuestionModel: mongoose.Model<RcycAssessmentQuestions>,
  ) {}

  async create(createRcycAssessmentRecordDto: CreateRcycAssessmentRecordDto): Promise<RcycAssessmentRecord> {
    const { userId, responses } = createRcycAssessmentRecordDto;
    // console.log("createRcycAssessmentRecordDto is here :", createRcycAssessmentRecordDto);

    const user = await this.rcycUserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const formattedResponses = [];

    for (const response of responses) {
      const question = await this.rcycQuestionModel.findById(response.questionId);
      if (!question) {
        throw new NotFoundException(`Question with ID ${response.questionId} not found`);
      }

      const ratings = response.ratings.map((rating, index) => ({
        option: question.options[index].option,
        value: question.options[index].value,
        rating: rating.rating,
      }));

      formattedResponses.push({
        question: response.questionId,
        questionName: question.mainQuestion,  
        ratings,
      });
    }
    await this.rcycUserService.updateUserStatus(user.id, "assessmentDone");

    const assessmentRecord = new this.rcycAssessmentRecordModel({
      user,
      responses: formattedResponses,
    });
    // console.log(assessmentRecord);

    return assessmentRecord.save();
  }

  async findAll(): Promise<RcycAssessmentRecord[]> {
    return this.rcycAssessmentRecordModel.find().sort({ createdAt: -1 });
  }

  async findAssessmentRecordListByUser(user: string): Promise<RcycAssessmentRecord[]> {
    const assessmentRecords = await this.rcycAssessmentRecordModel
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
  

  
  async findById(id: string): Promise<RcycAssessmentRecord> {
    const assessmentRecord = await this.rcycAssessmentRecordModel.findById(id).exec();
    if (!assessmentRecord) {
      throw new NotFoundException(`assessmentRecord with ID ${id} not found`);
    }
    return assessmentRecord;
  }
  

  async findOne1(id: string): Promise<any> {
    const assessmentRecord = await this.rcycAssessmentRecordModel
    .findById(id)
    // .populate({
    //   path: 'responses.question',
    //   model: this.rcycQuestionModel.modelName, // Explicitly specify the model name
    //   select: 'mainQuestion options'
    // })
    // .exec();
  

    if (!assessmentRecord) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    const user = await this.rcycUserModel.findById(assessmentRecord.user).exec();
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

//   async getRatingCounts(id: string): Promise<any> {
//     // Fetch the specific assessment record
//     const assessmentRecord = await this.rcycAssessmentRecordModel.findById(id).exec();
//     if (!assessmentRecord) {
//         throw new NotFoundException(`Assessment record with ID ${id} not found`);
//     }

//     const user = await this.rcycUserModel.findById(assessmentRecord.user).exec();
//     if (!user) {
//         throw new NotFoundException(`User with ID ${assessmentRecord.user} not found`);
//     }

//     // Initialize counts for each value and rating
//     const counts: Record<string, number> = {
//         'D_1': 0, 'D_2': 0, 'D_3': 0, 'D_4': 0,
//         'G_1': 0, 'G_2': 0, 'G_3': 0, 'G_4': 0,
//         'C_1': 0, 'C_2': 0, 'C_3': 0, 'C_4': 0,
//         'S_1': 0, 'S_2': 0, 'S_3': 0, 'S_4': 0,
//     };

//     // Count the number of attended questions
//     let attendedQuestionsCount = 0;

//     assessmentRecord.responses.forEach(response => {
//         let questionAnswered = false;

//         response.ratings.forEach(rating => {
//             const key = `${rating.value}_${rating.rating}`;
//             if (counts[key] !== undefined) {
//                 counts[key]++;
//             }

//             // Check if at least one rating is present for the question
//             if (rating.rating) {
//                 questionAnswered = true;
//             }
//         });

//         // Increment attended questions count if this question was answered
//         if (questionAnswered) {
//             attendedQuestionsCount++;
//         }
//     });

//     return {
//         user: {
//             userId: user._id,
//         },
//         attendedQuestionsCount,
//         counts,
//     };
// }


async getRatingCounts(id: string): Promise<any> {
  const assessmentRecord = await this.rcycAssessmentRecordModel.findById(id).exec();
  if (!assessmentRecord) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
  }

  const user = await this.rcycUserModel.findById(assessmentRecord.user).exec();
  if (!user) {
      throw new NotFoundException(`User with ID ${assessmentRecord.user} not found`);
  }

  const counts: Record<string, number> = {
      'D_1': 0, 'D_2': 0, 'D_3': 0, 'D_4': 0,
      'G_1': 0, 'G_2': 0, 'G_3': 0, 'G_4': 0,
      'C_1': 0, 'C_2': 0, 'C_3': 0, 'C_4': 0,
      'S_1': 0, 'S_2': 0, 'S_3': 0, 'S_4': 0,
  };

  let attendedQuestionsCount = 0;

  assessmentRecord.responses.forEach(response => {
      let questionAnswered = false;

      response.ratings.forEach(rating => {
          const key = `${rating.value}_${rating.rating}`;
          if (counts[key] !== undefined) {
              counts[key]++;
          }

          if (rating.rating) {
              questionAnswered = true;
          }
      });

      if (questionAnswered) {
          attendedQuestionsCount++;
      }
  });

  const priorities = ['D', 'G', 'C', 'S'];
  let finalValue = '';

  const level1Values = priorities.map(key => counts[`${key}_1`]);
  const maxLevel1 = Math.max(...level1Values);
  const topKeysLevel1 = priorities.filter(key => counts[`${key}_1`] === maxLevel1);

  if (topKeysLevel1.length === 1) {
      finalValue = topKeysLevel1[0];
  } else {
      const level2Values = topKeysLevel1.map(key => counts[`${key}_2`]);
      const maxLevel2 = Math.max(...level2Values);
      const topKeysLevel2 = topKeysLevel1.filter(key => counts[`${key}_2`] === maxLevel2);

      if (topKeysLevel2.length === 1) {
          finalValue = topKeysLevel2[0];
      } else {
          const level3Values = topKeysLevel2.map(key => counts[`${key}_3`]);
          const maxLevel3 = Math.max(...level3Values);
          const topKeysLevel3 = topKeysLevel2.filter(key => counts[`${key}_3`] === maxLevel3);

          if (topKeysLevel3.length === 1) {
              finalValue = topKeysLevel3[0];
          } else {
              const level4Values = topKeysLevel3.map(key => counts[`${key}_4`]);
              const maxLevel4 = Math.max(...level4Values);
              const topKeysLevel4 = topKeysLevel3.filter(key => counts[`${key}_4`] === maxLevel4);

              if (topKeysLevel4.length === 1) {
                  finalValue = topKeysLevel4[0];
              }
          }
      }
  }

  return {
      user: {
          userId: user._id,
      },
      attendedQuestionsCount,
      counts,
      finalValue, 
  };
}

  async update(id: string, updateRcycAssessmentRecordDto: UpdateRcycAssessmentRecordDto): Promise<RcycAssessmentRecord> {
    const assessmentRecord = await this.rcycAssessmentRecordModel.findByIdAndUpdate(
      id,
      updateRcycAssessmentRecordDto,
      { new: true } 
    );

    if (!assessmentRecord) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    return assessmentRecord;
  }

  async remove(id: string): Promise<any> {
    const result = await this.rcycAssessmentRecordModel.findByIdAndDelete(id);
    
    if (!result) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    return { message: `Assessment record with ID ${id} deleted successfully` };
  }
}