import { CreateSee360AssessmentRecordDto } from './dto/create-See-360-assessment-record.dto';
import { UpdateSee360AssessmentRecordDto } from './dto/update-See-360-assessment-record.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { See360AssessmentRecord } from './entities/See-360-assessment-record.entity';
import { See360AssessmentQuestions } from '../see-360-assessment-questions/entities/see-360-assessment-question.entity';
import { See360UserService } from '../see-360-user/see-360-user.service';
import { See360User } from '../see-360-user/entities/see-360-user.entity';

@Injectable()
export class See360AssessmentRecordsService {
  constructor(
    private see360UserService: See360UserService,
    @InjectModel(See360AssessmentRecord.name , 'See360') private see360AssessmentRecordModel: mongoose.Model<See360AssessmentRecord>,
    @InjectModel(See360User.name, 'See360') private see360UserModel: mongoose.Model<See360User>,
    @InjectModel(See360AssessmentQuestions.name, 'See360') private see360QuestionModel: mongoose.Model<See360AssessmentQuestions>,
  ) {}

  async create(createSee360AssessmentRecordDto: CreateSee360AssessmentRecordDto): Promise<See360AssessmentRecord> {
    const { userId, responses } = createSee360AssessmentRecordDto;
    // console.log("createSee360AssessmentRecordDto is here :", createSee360AssessmentRecordDto);

    const user = await this.see360UserModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const formattedResponses = [];

    for (const response of responses) {
      const question = await this.see360QuestionModel.findById(response.questionId);
      if (!question) {
        throw new NotFoundException(`Question with ID ${response.questionId} not found`);
      }
        // Resolve the `answered` option using the `optionId`
    const selectedOption = question.options.find(
      (option) => option._id.toString() === response.answered.optionId,
    );

    if (!selectedOption) {
      throw new BadRequestException(
        `Invalid option ID for question ${response.answered.optionId}`,
      );
    }

    // Format the resolved answer
    const formattedAnswer = {
      option: selectedOption.option,
      value: selectedOption.value,
      marks: selectedOption.marks,
      _id: selectedOption._id,
    };


      // Format the options based on the options in the question
      const options = question.options.map((option) => ({
        option: option.option,
        value: option.value,
        marks: option.marks,
        _id: option._id,
      }));

      formattedResponses.push({
        question: response.questionId,
        category: question.category,
        questionName: question.mainQuestion,  
        answered: formattedAnswer,
        options,
      });
    }
    await this.see360UserService.updateUserStatus(user.id, "assessmentDone");

    const assessmentRecord = new this.see360AssessmentRecordModel({
      user,
      responses: formattedResponses,
    });
    // console.log(assessmentRecord);

    return assessmentRecord.save();
  }

  async findAll(): Promise<See360AssessmentRecord[]> {
    return this.see360AssessmentRecordModel.find().sort({ createdAt: -1 });
  }

  async findAssessmentRecordListByUser(user: string): Promise<See360AssessmentRecord[]> {
    const assessmentRecords = await this.see360AssessmentRecordModel
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
  

  
  async findById(id: string): Promise<See360AssessmentRecord> {
    const assessmentRecord = await this.see360AssessmentRecordModel.findById(id).exec();
    if (!assessmentRecord) {
      throw new NotFoundException(`assessmentRecord with ID ${id} not found`);
    }
    return assessmentRecord;
  }
  

//   async findOne1(id: string): Promise<any> {
//     const assessmentRecord = await this.see360AssessmentRecordModel
//     .findById(id)
//     // .populate({
//     //   path: 'responses.question',
//     //   model: this.see360QuestionModel.modelName, // Explicitly specify the model name
//     //   select: 'mainQuestion options'
//     // })
//     // .exec();
  

//     if (!assessmentRecord) {
//       throw new NotFoundException(`Assessment record with ID ${id} not found`);
//     }

//     const user = await this.see360UserModel.findById(assessmentRecord.user).exec();
//     if (!user) {
//       throw new NotFoundException(`User with ID ${assessmentRecord.user} not found`);
//     }

//     const optionStats = {
//       option1: { 1: 0, 2: 0, 3: 0, 4: 0 },
//       option2: { 1: 0, 2: 0, 3: 0, 4: 0 },
//       option3: { 1: 0, 2: 0, 3: 0, 4: 0 },
//       option4: { 1: 0, 2: 0, 3: 0, 4: 0 },
//     };

//     let attendedQuestionsCount = 0;

//     assessmentRecord.responses.forEach(response => {
//       attendedQuestionsCount += 1;

//       response.options.forEach((rating, index) => {
//         const optionKey = `option${index + 1}`; 
//         const ratingValue = rating.rating;

//         if (optionStats[optionKey][ratingValue] !== undefined) {
//           optionStats[optionKey][ratingValue] += 1;
//         }
//       });
//     });

//     return {
//       user: {
//         userId: user._id,
//         // fullName: user.fullName,
//         // email: user.email,
//         // phoneNumber: user.phoneNumber,
//       },
//       // Date: assessmentRecord.createdAt,
//       attendedQuestionsCount,
//       optionStats,
//     };
//   }

//   async getRatingCounts(id: string): Promise<any> {
//     // Fetch the specific assessment record
//     const assessmentRecord = await this.see360AssessmentRecordModel.findById(id).exec();
//     if (!assessmentRecord) {
//         throw new NotFoundException(`Assessment record with ID ${id} not found`);
//     }

//     const user = await this.see360UserModel.findById(assessmentRecord.user).exec();
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

//         response.options.forEach(rating => {
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


// async getRatingCounts(id: string): Promise<any> {
//   const assessmentRecord = await this.see360AssessmentRecordModel.findById(id).exec();
//   if (!assessmentRecord) {
//       throw new NotFoundException(`Assessment record with ID ${id} not found`);
//   }

//   const user = await this.see360UserModel.findById(assessmentRecord.user).exec();
//   if (!user) {
//       throw new NotFoundException(`User with ID ${assessmentRecord.user} not found`);
//   }

//   const counts: Record<string, number> = {
//       'D_1': 0, 'D_2': 0, 'D_3': 0, 'D_4': 0,
//       'G_1': 0, 'G_2': 0, 'G_3': 0, 'G_4': 0,
//       'C_1': 0, 'C_2': 0, 'C_3': 0, 'C_4': 0,
//       'S_1': 0, 'S_2': 0, 'S_3': 0, 'S_4': 0,
//   };

//   let attendedQuestionsCount = 0;

//   assessmentRecord.responses.forEach(response => {
//       let questionAnswered = false;

//       response.options.forEach(rating => {
//           const key = `${rating.value}_${rating.rating}`;
//           if (counts[key] !== undefined) {
//               counts[key]++;
//           }

//           if (rating.rating) {
//               questionAnswered = true;
//           }
//       });

//       if (questionAnswered) {
//           attendedQuestionsCount++;
//       }
//   });

//   const priorities = ['D', 'G', 'C', 'S'];
//   let finalValue = '';

//   const level1Values = priorities.map(key => counts[`${key}_1`]);
//   const maxLevel1 = Math.max(...level1Values);
//   const topKeysLevel1 = priorities.filter(key => counts[`${key}_1`] === maxLevel1);

//   if (topKeysLevel1.length === 1) {
//       finalValue = topKeysLevel1[0];
//   } else {
//       const level2Values = topKeysLevel1.map(key => counts[`${key}_2`]);
//       const maxLevel2 = Math.max(...level2Values);
//       const topKeysLevel2 = topKeysLevel1.filter(key => counts[`${key}_2`] === maxLevel2);

//       if (topKeysLevel2.length === 1) {
//           finalValue = topKeysLevel2[0];
//       } else {
//           const level3Values = topKeysLevel2.map(key => counts[`${key}_3`]);
//           const maxLevel3 = Math.max(...level3Values);
//           const topKeysLevel3 = topKeysLevel2.filter(key => counts[`${key}_3`] === maxLevel3);

//           if (topKeysLevel3.length === 1) {
//               finalValue = topKeysLevel3[0];
//           } else {
//               const level4Values = topKeysLevel3.map(key => counts[`${key}_4`]);
//               const maxLevel4 = Math.max(...level4Values);
//               const topKeysLevel4 = topKeysLevel3.filter(key => counts[`${key}_4`] === maxLevel4);

//               if (topKeysLevel4.length === 1) {
//                   finalValue = topKeysLevel4[0];
//               }
//           }
//       }
//   }

//   return {
//       user: {
//           userId: user._id,
//       },
//       attendedQuestionsCount,
//       counts,
//       finalValue, 
//   };
// }

  async update(id: string, updateSee360AssessmentRecordDto: UpdateSee360AssessmentRecordDto): Promise<See360AssessmentRecord> {
    const assessmentRecord = await this.see360AssessmentRecordModel.findByIdAndUpdate(
      id,
      updateSee360AssessmentRecordDto,
      { new: true } 
    );

    if (!assessmentRecord) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    return assessmentRecord;
  }

  async remove(id: string): Promise<any> {
    const result = await this.see360AssessmentRecordModel.findByIdAndDelete(id);
    
    if (!result) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    return { message: `Assessment record with ID ${id} deleted successfully` };
  }
}