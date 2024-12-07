import { CreateAssessmentRecordDto } from './dto/create-assessment-record.dto';
import { UpdateAssessmentRecordDto } from './dto/update-assessment-record.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { AssessmentRecord } from './entities/assessment-record.entity';
import { AssessmentQuestions } from '../mr-right-assessment-questions/entities/assessment-question.entity';
import { User } from '../mr-right-user/entities/user.entity';
import { UserService } from '../mr-right-user/user.service';

@Injectable()
export class AssessmentRecordsService {
  constructor(
    private userService: UserService,
    @InjectModel(AssessmentRecord.name , 'MrRight') private assessmentRecordModel: mongoose.Model<AssessmentRecord>,
    @InjectModel(User.name, 'MrRight') private userModel: mongoose.Model<User>,
    @InjectModel(AssessmentQuestions.name, 'MrRight') private questionModel: mongoose.Model<AssessmentQuestions>,
  ) {}

  async create(createAssessmentRecordDto: CreateAssessmentRecordDto): Promise<AssessmentRecord> {
    const { userId, responses } = createAssessmentRecordDto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const formattedResponses = [];

    for (const response of responses) {
      const question = await this.questionModel.findById(response.questionId);
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
    await this.userService.updateUserStatus(user.id, "assessmentDone");

    const assessmentRecord = new this.assessmentRecordModel({
      user,
      responses: formattedResponses,
    });
    // console.log(assessmentRecord);

    return assessmentRecord.save();
  }

  async findAll(): Promise<AssessmentRecord[]> {
    return this.assessmentRecordModel.find().sort({ createdAt: -1 });
  }

  async findAssessmentRecordListByUser(user: string): Promise<AssessmentRecord[]> {
    const assessmentRecords = await this.assessmentRecordModel
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
  

  
  async findById(id: string): Promise<AssessmentRecord> {
    const assessmentRecord = await this.assessmentRecordModel.findById(id).exec();
    if (!assessmentRecord) {
      throw new NotFoundException(`assessmentRecord with ID ${id} not found`);
    }
    return assessmentRecord;
  }
  

  async findOne1(id: string): Promise<any> {
    const assessmentRecord = await this.assessmentRecordModel
    .findById(id)
    // .populate({
    //   path: 'responses.question',
    //   model: this.questionModel.modelName, // Explicitly specify the model name
    //   select: 'mainQuestion options'
    // })
    // .exec();
  

    if (!assessmentRecord) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    const user = await this.userModel.findById(assessmentRecord.user).exec();
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
//     const assessmentRecord = await this.assessmentRecordModel.findById(id).exec();
//     if (!assessmentRecord) {
//         throw new NotFoundException(`Assessment record with ID ${id} not found`);
//     }

//     const user = await this.userModel.findById(assessmentRecord.user).exec();
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


// async getRatingCounts(id: string): Promise<any> {
//   // Fetch the specific assessment record
//   const assessmentRecord = await this.assessmentRecordModel.findById(id).exec();
//   if (!assessmentRecord) {
//       throw new NotFoundException(`Assessment record with ID ${id} not found`);
//   }

//   const user = await this.userModel.findById(assessmentRecord.user).exec();
//   if (!user) {
//       throw new NotFoundException(`User with ID ${assessmentRecord.user} not found`);
//   }

//   // Initialize counts for each value and rating
//   const counts: Record<string, number> = {
//       'D_1': 0, 'D_2': 0, 'D_3': 0, 'D_4': 0,
//       'G_1': 0, 'G_2': 0, 'G_3': 0, 'G_4': 0,
//       'C_1': 0, 'C_2': 0, 'C_3': 0, 'C_4': 0,
//       'S_1': 0, 'S_2': 0, 'S_3': 0, 'S_4': 0,
//   };

//   // Count the number of attended questions
//   let attendedQuestionsCount = 0;

//   assessmentRecord.responses.forEach(response => {
//       let questionAnswered = false;

//       response.ratings.forEach(rating => {
//           const key = `${rating.value}_${rating.rating}`;
//           if (counts[key] !== undefined) {
//               counts[key]++;
//           }

//           // Check if at least one rating is present for the question
//           if (rating.rating) {
//               questionAnswered = true;
//           }
//       });

//       // Increment attended questions count if this question was answered
//       if (questionAnswered) {
//           attendedQuestionsCount++;
//       }
//   });

//   // Determine the final value
//   const determineFinalValue = (): string => {
//       const primaryKeys = ['D_1', 'G_1', 'C_1', 'S_1'];
//       const secondaryKeys = ['D_2', 'G_2', 'C_2', 'S_2'];
//       const tertiaryKeys = ['D_3', 'G_3', 'C_3', 'S_3'];
//       const quaternaryKeys = ['D_4', 'G_4', 'C_4', 'S_4'];

//       // Helper function to find the key with the highest value
//       const getHighestKey = (keys: string[]): { maxKey: string | null, maxValue: number } => {
//           let maxKey: string | null = null;
//           let maxValue = -1;

//           keys.forEach(key => {
//               if (counts[key] > maxValue) {
//                   maxKey = key;
//                   maxValue = counts[key];
//               } else if (counts[key] === maxValue) {
//                   maxKey = null; // Tie: no clear maxKey
//               }
//           });

//           return { maxKey, maxValue };
//       };

//       // Step 1: Check primary keys
//       let { maxKey, maxValue } = getHighestKey(primaryKeys);

//       // Step 2: If there's a tie in primary keys, check secondary keys
//       if (!maxKey) {
//           const tiedKeys = primaryKeys.filter(key => counts[key] === maxValue);
//           ({ maxKey, maxValue } = getHighestKey(
//               tiedKeys.map(key => key.replace('_1', '_2')) // Replace '_1' with '_2'
//           ));
//       }

//       // Step 3: If there's a tie in secondary keys, check tertiary keys
//       if (!maxKey) {
//           const tiedKeys = primaryKeys.filter(key => counts[key] === maxValue);
//           ({ maxKey, maxValue } = getHighestKey(
//               tiedKeys.map(key => key.replace('_1', '_3')) // Replace '_1' with '_3'
//           ));
//       }

//       // Step 4: If there's a tie in tertiary keys, check quaternary keys
//       if (!maxKey) {
//           const tiedKeys = primaryKeys.filter(key => counts[key] === maxValue);
//           ({ maxKey, maxValue } = getHighestKey(
//               tiedKeys.map(key => key.replace('_1', '_4')) // Replace '_1' with '_4'
//           ));
//       }

//       // Return the final value
//       if (maxKey) {
//           return maxKey.split('_')[0]; // Extract 'D', 'G', 'C', or 'S'
//       }
//       return ''; // If no clear winner
//   };

//   const finalValue = determineFinalValue();

//   return {
//       user: {
//           userId: user._id,
//       },
//       attendedQuestionsCount,
//       counts,
//       finalValue,
//   };
// }

async getRatingCounts(id: string): Promise<any> {
  const assessmentRecord = await this.assessmentRecordModel.findById(id).exec();
  if (!assessmentRecord) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
  }

  const user = await this.userModel.findById(assessmentRecord.user).exec();
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


  async update(id: string, updateAssessmentRecordDto: UpdateAssessmentRecordDto): Promise<AssessmentRecord> {
    const assessmentRecord = await this.assessmentRecordModel.findByIdAndUpdate(
      id,
      updateAssessmentRecordDto,
      { new: true } 
    );

    if (!assessmentRecord) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    return assessmentRecord;
  }

  async remove(id: string): Promise<any> {
    const result = await this.assessmentRecordModel.findByIdAndDelete(id);
    
    if (!result) {
      throw new NotFoundException(`Assessment record with ID ${id} not found`);
    }

    return { message: `Assessment record with ID ${id} deleted successfully` };
  }
}