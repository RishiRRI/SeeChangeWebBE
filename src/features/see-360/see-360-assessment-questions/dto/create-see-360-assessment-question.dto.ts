export class CreateSee360AssessmentQuestionDto {
    readonly category: string;
    readonly mainQuestion: string;
    readonly options: Array<{ option: string; value: string; marks: number }>;
  }
  